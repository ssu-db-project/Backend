package com.ssu.DB_Project.crawl.sitecrawl;

import io.github.bonigarcia.wdm.WebDriverManager;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Component;

@Component
public class SsuPath implements SiteCrawler {

    // DB 저장용
    //@Autowired
    //private PolicyRepository policyRepository;

    // GPT 모듈 주입

    // 크롤링할 사이트
    private static final String BASE_URL = "https://smartid.ssu.ac.kr/Symtra_sso/smln.asp?apiReturnUrl=https://path.ssu.ac.kr/comm/login/user/loginProc.do?rtnUrl=";

    // 사이트 크롤링
    // 프로세스는 사이트 접속 -> 데이터 수집 -> gpt 모듈 호출해서 데이터 분석/가공 -> DB 저장
    @Override
    public void crawl() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--remote-allow-origins=*");

        WebDriver driver = new ChromeDriver(options);
        String myId = "20231739"; // 학번
        String myPwd = ""; //비번

        try{
            InputStream input = getClass().getClassLoader()
                .getResourceAsStream("env.properties"); //resources.env.properties
            Properties prop = new Properties();
            prop.load(input);
            myPwd = prop.getProperty("SSU_PWD");

            driver.get(BASE_URL);
            Thread.sleep(2000);


            driver.findElement(By.id("userid")).sendKeys(myId);
            driver.findElement(By.id("pwd")).sendKeys(myPwd);
            driver.findElement(By.className("btn_login")).click();
            Thread.sleep(2000);
            WebElement menuLink = driver.findElement(By.cssSelector("a[href*='findIcmpNsbjtPgmList.do']"));
            JavascriptExecutor executor = (JavascriptExecutor) driver;
            executor.executeScript("arguments[0].click();", menuLink);
            Thread.sleep(3000);
            ///////

            List<WebElement> checkboxes = driver.findElements(By.name("prgmClsCdSh"));
            String[] targetCodes = {"PC01", "PC02", "PC05"};
            for (String code : targetCodes) {

                System.out.println("\n🔄 [" + code + "] 카테고리 설정 중...");

                // A. [초기화] 모든 체크박스 끄기 (하나만 선택된 상태를 보장하기 위해)
                List<WebElement> allCheckboxes = driver.findElements(By.name("prgmClsCdSh"));
                for (WebElement checkbox : allCheckboxes) {
                    if (checkbox.isSelected()) {
                        executor.executeScript("arguments[0].click();", checkbox);
                    }
                    try {
                        // ID로 찾기 (예: id="prgmClsCdShPC01")
                        WebElement targetCheckbox = driver.findElement(By.id("prgmClsCdSh" + code));

                        if (!targetCheckbox.isSelected()) {
                            executor.executeScript("arguments[0].click();", targetCheckbox);
                            System.out.println("   ✅ 체크 활성화: " + code);
                        }
                    } catch (Exception e) {
                        System.out.println("   ⚠️ 체크박스 없음 (건너뜀): " + code);
                        continue;
                    }
                    try {
                        WebElement searchInput = driver.findElement(By.id("searchValue"));

                        // 3. 엔터키 입력! (검색 버튼 클릭과 같은 효과)
                        searchInput.sendKeys(Keys.ENTER);

                        System.out.println("   🔍 검색 실행 (Enter)");

                        // 4. 로딩 대기 (검색 결과가 바뀔 때까지 기다림)
                        Thread.sleep(2000);

                    } catch (Exception e) {
                        System.out.println("   ⚠️ 검색 버튼 클릭 실패 (체크박스만 바꾸고 진행합니다)");
                    }
////여기까지 ㄱㅊ
                    // -------------------------------------------------------
                    // D. [크롤링] 이제 리스트가 갱신되었으니 데이터를 긁습니다.
                    // -------------------------------------------------------
                    System.out.println("   🚀 [" + code + "] 목록 크롤링 시작...");
                    List<WebElement> titleLinks = driver.findElements(By.cssSelector("a.tit.detailBtn"));

                    if (titleLinks.isEmpty()) {
                        System.out.println("⚠️ 목록이 없습니다.");
                        return;
                    }

                    List<String> detailUrls = new ArrayList<>();

// 2. ID 추출 및 URL 조립
                    for (WebElement link : titleLinks) {
                        try {
                            // data-params 속성 가져오기
                            // 예: {"encSddpbSeq":"52552...","paginationInfo.currentPageNo":"1"}
                            String params = link.getAttribute("data-params");

                            if (params != null) {
                                // 정규식으로 "encSddpbSeq":"값" 패턴에서 값만 추출
                                Pattern pattern = Pattern.compile("\"encSddpbSeq\":\"([^\"]+)\"");
                                Matcher matcher = pattern.matcher(params);

                                if (matcher.find()) {
                                    String id = matcher.group(1); // 추출된 ID

                                    // 상세 페이지 URL 조립
                                    String fullUrl = "https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmView.do?encSddpbSeq=" + id;

                                    detailUrls.add(fullUrl);
                                    System.out.println("   🔗 추출된 URL: " + fullUrl);
                                }
                            }
                        } catch (Exception e) {
                            System.out.println("   ❌ 파싱 실패: " + e.getMessage());
                        }
                    }

                    System.out.println("총 " + detailUrls.size() + "개의 상세 URL 확보 완료!");

// 3. 확보된 URL로 하나씩 접속해서 크롤링 (이후 로직)
                    for (String url : detailUrls) {
                         driver.get(url);
                        // ... 상세 내용 크롤링 ...
                    }
                }
            }

        }catch (Exception e){
            System.err.println(e.getMessage());
        }
    }

    // 크롤링 사이트명 제출
    @Override
    public String getSiteName() {
        return "슈패스";
    }

}
