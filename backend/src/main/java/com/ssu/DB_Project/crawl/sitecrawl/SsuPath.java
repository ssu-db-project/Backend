package com.ssu.DB_Project.crawl.sitecrawl;

import com.ssu.DB_Project.program.dto.ProgramProcessRequest;
import com.ssu.DB_Project.program.repository.ProgramRepository;
import com.ssu.DB_Project.program.service.ProgramService;
import io.github.bonigarcia.wdm.WebDriverManager;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class SsuPath implements SiteCrawler {

    // DB 저장용 - 폐기
    //@Autowired
    //private PolicyRepository policyRepository;

    // DB 검색, 저장용
    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private ProgramService programService;

    // GPT 모듈 주입

    // 크롤링 로그인 아이디/비밀번호
    @Value("${ssu.id}")
    private String SSU_ID;

    @Value("${ssu.pw}")
    private String SSU_PW;

    // 크롤링할 사이트
    // 로그인 사이트
    private static final String LOGIN_URL = "https://smartid.ssu.ac.kr/Symtra_sso/smln.asp?apiReturnUrl=https://path.ssu.ac.kr/comm/login/user/loginProc.do?rtnUrl=/index.do?paramStart=paramStart";

    // 슈패스 비교과 프로그램 목록
    private static final String SSUPATH_URL = "https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmList.do";

    // 슈패스 상세 페이지 기본 url
    private static final String SSUPATH_INFO_URL = "https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmInfo.do";

    // 사이트 크롤링
    // 프로세스는 사이트 접속 -> 데이터 수집 -> gpt 모듈 호출해서 데이터 분석/가공 -> DB 저장
    @Override
    public void crawl() {
        System.out.println("Selenium 슈패스 크롤링 시작");

        // 크롤링 세팅
        WebDriverManager.chromedriver().setup();

        ChromeOptions chromeOptions = new ChromeOptions();

        chromeOptions.addArguments("--remote-allow-origins=*");
        chromeOptions.addArguments("--disable-popup-blocking");
        chromeOptions.addArguments("--no-sandbox");
        chromeOptions.addArguments("--disable-dev-shm-usage");

        WebDriver webDriver = new ChromeDriver(chromeOptions);
        WebDriverWait webDriverWait = new WebDriverWait(webDriver, Duration.ofSeconds(10));

        try {
            // 1. 슈패스 로그인
            System.out.println("슈게더 로그인");
            webDriver.get(LOGIN_URL);

            // 로그인 접근
            WebElement idInput = webDriverWait.until(ExpectedConditions.visibilityOfElementLocated(By.name("userid")));
            WebElement pwInput = webDriver.findElement(By.name("pwd"));

            // 로그인 값 입력
            JavascriptExecutor js = (JavascriptExecutor) webDriver;
            js.executeScript("arguments[0].value='" + SSU_ID + "';", idInput);
            js.executeScript("arguments[0].value='" + SSU_PW + "';", pwInput);

            // 로그인 실행
            try {
                System.out.println("슈패스 LoginInfoSend() 함수 호출");
                js.executeScript("LoginInfoSend('LoginInfo');");
            } catch (Exception e) {
                // 혹시 JS 호출이 막히면 엔터키로 시도
                System.out.println("슈패스 JS 호출 실패, 엔터키 입력 시도");
                pwInput.sendKeys(Keys.ENTER);
            }

            Thread.sleep(3000);

            // 2. 목록 페이지 이동 및 수집
            // [수정] 리스트 선언을 반복문 밖으로 이동하여 누적
            List<CrawlTarget> crawlTargetList = new ArrayList<>();

            // [수정] 2페이지까지 수집하기 위한 변수 및 반복문 추가
            int MAX_PAGE = 2;

            for (int page = 1; page <= MAX_PAGE; page++) {
                System.out.println("슈패스 비교과 페이지 수집 중 : " + page + "페이지");

                // [수정] 페이지 이동 로직 추가 (1페이지는 URL 접속, 2페이지부터는 JS 실행)
                if (page == 1) {
                    webDriver.get(SSUPATH_URL);

                    webDriverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("div.lica_wrap")));
                } else {
                    try {
                        // 페이지네이션 링크를 찾아 클릭 시도
                        // 웹 표준에 따라 'pagination' 클래스 내의 해당 페이지 번호 <a> 태그를 찾음
                        WebElement pageLink = webDriverWait.until(
                                ExpectedConditions.elementToBeClickable(By.xpath("//div[@class='pagination']//a[text()='" + page + "']"))
                        );

                        // 클릭 실행
                        pageLink.click();

                        // 새 페이지의 목록 요소가 로드될 때까지 대기
                        webDriverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("div.lica_wrap")));
                    } catch (Exception e) {
                        System.out.println("페이지 이동 실패: " + e.getMessage());
                        break;
                    }
                }

                // 페이지 로딩 대기
                webDriverWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("div.lica_wrap")));
                Thread.sleep(1000); // 페이지 전환 안정화 대기

                List<WebElement> webElementList =  webDriver.findElements(By.cssSelector("div.lica_wrap > ul > li"));

                if (webElementList.isEmpty()) {
                    System.out.println("수집할 데이터가 없습니다.");
                    break; // 데이터가 없으면 루프 종료
                }

                for (WebElement webElement : webElementList) {
                    try {
                        // 1. 제목 및 상세 파라미터 추출
                        WebElement titleTag = webElement.findElement(By.cssSelector(".text_wrap .tit"));
                        String title = titleTag.getText().trim();

                        // data-params에서 encSddpbSeq 추출하여 URL 조립
                        String dataParams = titleTag.getAttribute("data-params");
                        String encSeq = extractEncSeq(dataParams);

                        if (encSeq.isEmpty()) {
                            System.out.println("URL 파라미터 추출 실패 : " + title);

                            continue;
                        }

                        // 상세 URL 조립
                        String finalUrl = SSUPATH_INFO_URL + "?encSddpbSeq=" + encSeq;

                        // 2. 부서  추출
                        String dept = null;


                        try {
                            dept = webElement.findElement(By.cssSelector(".major_type li.first")).getText().trim();
                            //category = webElement.findElement(By.cssSelector(".major_type li.last")).getText().trim();
                        } catch (Exception e) {
                            // 못 찾으면 null 유지
                        }

                        // 상태 추출
                        String status = null;
                        try {
                            status = webElement.findElement(By.cssSelector(".label_box span")).getText().trim();
                        } catch (Exception e) {
                            // 못 찾으면 null 유지
                        }

                        // 날짜 추출
                        String dateInfo = null;
                        try {
                            List<WebElement> dls = webElement.findElements(By.cssSelector(".info_wrap dl"));
                            for (WebElement dl : dls) {
                                String dtText = dl.findElement(By.tagName("dt")).getText();

                                if (dtText.contains("신청기간")) {
                                    dateInfo = dl.findElement(By.tagName("dd")).getText().trim();

                                    break;
                                }
                            }
                        } catch (Exception e) {

                        }

                        crawlTargetList.add(new CrawlTarget(title, finalUrl, dateInfo, status, dept));


                    } catch (Exception e) {
                        System.out.println("항목 파싱 실패");
                    }
                }
            } // end for loop

            System.out.println("총 수집된 데이터: " + crawlTargetList.size() + "개");

            for (CrawlTarget target : crawlTargetList) {
                //System.out.println(" - [" + target.category() + "] " + target.title());
                System.out.println("   -> " + target.url());
            }

            // 상세 페이지 순회 및 저장
            int saveCount = 0;

            for (CrawlTarget crawlTarget : crawlTargetList) {
                // 중복 검사
                if (programRepository.existsByOriginalUrl(crawlTarget.url())) {
                    System.out.println(crawlTarget.title() + "은 이미 수집했으니 패스");

                    continue;
                }

                try {
                    System.out.println("상세 수집 : " + crawlTarget.title());
                    webDriver.get(crawlTarget.url());

                    Thread.sleep(800);

                    // 본문 수집
                    String contentBody = "";

                    try {
                        contentBody = webDriver.findElement(By.id("tilesContent")).getText(); //신청기간때문에 ai한테 전체 넘겼는데 수정해야할수도있음
                        //contentBody = webDriver.findElement(By.cssSelector(".ck-contentEditDiv")).getText();
                    } catch (Exception e) {
                        System.out.println("   ⚠️ .td_box 없음, 전체 본문 수집 시도");
                        contentBody = webDriver.findElement(By.tagName("body")).getText();
                    }
                    //카테고리 수집
                    String category = null;
                    try {
                        WebElement categoryCell = webDriver.findElement(By.xpath("//th[contains(text(), '프로그램 분류')]/following-sibling::td"));

                        // 2. 텍스트 추출 및 공백 제거 (HTML에 탭과 공백이 많으므로 trim 필수)
                        category = categoryCell.getText().trim();

                        System.out.println("   🏷️ 추출된 분류: " + category);
                    } catch (Exception e) {
                        System.out.println("카테고리 수집 실패");
                    }

                    // 첨부파일 추후 협의 후 구현
                    /*
                    List<ProgramProcessRequest.FileDto> dbFiles = new ArrayList<>();

                    try {
                        List<WebElement> fileLinks = webDriver.findElements(By.cssSelector(".cmnFileLst a"));

                        for (WebElement f : fileLinks) {
                            String fUrl = f.getAttribute("href");
                            String fName = f.getText().trim();

                            if (fUrl != null && !fUrl.isEmpty() && !fName.equals("-") && !fName.isEmpty()) {
                                dbFiles.add(new ProgramProcessRequest.FileDto(fName, fUrl));
                            }
                        }
                    } catch (Exception e) {

                    }
                    */


                    String fullContent = "제목: " + crawlTarget.title() + "\n본문: " + contentBody;

                    ProgramProcessRequest programProcessRequest = new ProgramProcessRequest(
                            fullContent,
                            crawlTarget.url(),
                            category,
                            crawlTarget.dept()

                            // dbFiles 추후 구현
                    );

                    programService.processAndSave(programProcessRequest);

                    // System.out.println(" 저장 요청 완료 (" + dbFiles.size() + "개 파일)");

                    saveCount++;

                } catch (Exception e) {
                    System.out.println("상세 수집 실패" + e.getMessage());
                }
            }


        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (webDriver != null) {
                webDriver.quit();
                System.out.println("Selenium 브라우저 종료");
            }
        }



    }

    // JSON 파싱 헬퍼 메서드
    private String extractEncSeq(String jsonString) {
        try {

            Pattern pattern = Pattern.compile("\"encSddpbSeq\":\"([^\"]+)\"");
            Matcher matcher = pattern.matcher(jsonString);
            if (matcher.find()) {
                return matcher.group(1);
            }
        } catch (Exception e) {
            return "";
        }
        return "";
    }

    // 크롤링 사이트명 제출
    @Override
    public String getSiteName() {
        return "슈패스";
    }

    public record CrawlTarget(
            String title,
            String url,
            String date,
            String status,
            String dept
    ) {}
}