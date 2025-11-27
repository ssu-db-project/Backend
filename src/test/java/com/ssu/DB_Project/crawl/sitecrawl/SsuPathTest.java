package com.ssu.DB_Project.crawl.sitecrawl;

import static org.junit.jupiter.api.Assertions.*;

import io.github.bonigarcia.wdm.WebDriverManager;
import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import java.io.InputStream;
import java.util.Properties;

class SsuPathTest {

    // 펀시스템 로그인 페이지 URL
    private static final String LOGIN_URL = "https://smartid.ssu.ac.kr/Symtra_sso/smln.asp?apiReturnUrl=https://path.ssu.ac.kr/comm/login/user/loginProc.do?rtnUrl=";
//    @Value("${SSU_PWD}")
//    private String myPwd;

//    @Test
//    @DisplayName("펀시스템 로그인 및 메뉴 이동 테스트")
//    void loginAndMoveTest() {
//        // 1. 환경 변수에서 아이디/비번 가져오기 (보안 필수!)
//        // 실행 전 IntelliJ Edit Configurations -> Environment variables에 설정 필요
//        String myId = "20231739"; // 학번은 공개돼도 되면 이렇게 써도 됨
//        String myPwd = "";
//        int MAX_PN = 2;
//        // 1. 파일 읽기
//        try (InputStream input = getClass().getClassLoader()
//            .getResourceAsStream("env.properties")) {
//            Properties prop = new Properties();
//            if (input == null) {
//                System.out.println("파일을 못 찾았어요!");
//                return;
//            }
//            prop.load(input);
//
//            // 2. 값 꺼내기 (파일 안에 ssu.pwd=... 라고 되어있다면)
//            myPwd = prop.getProperty("SSU_PWD");
//
//            // 2. 브라우저 설정
//            WebDriverManager.chromedriver().setup();
//            ChromeOptions options = new ChromeOptions();
//            // options.addArguments("--headless"); // 💡 테스트할 때는 화면 보는 게 좋으니 주석 처리!
//            options.addArguments("--no-sandbox");
//            options.addArguments("--remote-allow-origins=*");
//
//            WebDriver driver = new ChromeDriver(options);
//
//            try {
//                System.out.println("🚀 로그인 페이지 접속 중...");
//                driver.get(LOGIN_URL);
//
//                // 로딩 대기 (Thread.sleep 대신 implicitlyWait 권장)
//                driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(3));
//
//                // 3. 로그인 수행
//                System.out.println("🔑 로그인 시도...");
//                driver.findElement(By.id("userid")).sendKeys(myId);
//                driver.findElement(By.id("pwd")).sendKeys(myPwd);
//
//                // .submit()은 form 태그 안에서만 작동하므로, click()이 더 안전할 수 있음
//                driver.findElement(By.className("btn_login")).click();
//
//                // 4. 로그인 후 페이지 전환 대기
//                Thread.sleep(2000);
//
//                // 5. 비교과 프로그램 목록 클릭
//                System.out.println("👆 '비교과프로그램' 메뉴 클릭 시도...");
//                // 1. 클릭할 요소를 먼저 찾습니다.
//                WebElement menuLink = driver.findElement(By.cssSelector("a[href*='findIcmpNsbjtPgmList.do']"));
//
//// 2. 자바스크립트 실행기를 준비합니다.
//                JavascriptExecutor executor = (JavascriptExecutor) driver;
//
//// 3. "내 눈앞에 뭐가 있든 무시하고 이 버튼을 눌러라" (강제 클릭 명령)
//                executor.executeScript("arguments[0].click();", menuLink);
//
//                // 클릭 후 이동 확인을 위해 잠시 대기
//                Thread.sleep(3000);
//
//                // 6. 결과 검증 (현재 URL이 목록 페이지로 바뀌었는지 확인)
//                String currentUrl = driver.getCurrentUrl();
//                System.out.println("📍 현재 URL: " + currentUrl);
//
//                if (currentUrl.contains("findIcmpNsbjtPgmList")) {
//                    System.out.println("✅ 테스트 성공! 목록 페이지로 이동했습니다.");
//                } else {
//                    System.out.println("⚠️ 테스트 실패? URL이 예상과 다릅니다.");
//                }
//                //여기부터 붙여넣기
//                // 1. 결과를 담을 Map 생성 (키: 카테고리코드, 값: URL리스트)
//                Map<String, List<String>> collectedData = new HashMap<>();
//
//                // 2. 순회할 타겟 코드 정의
//                String[] targetCodes = {"PC01", "PC02", "PC04"};
//
//                // ==========================================
//                // [반복문 시작] 카테고리별 순회
//                // ==========================================
//                for (String code : targetCodes) {
//                    System.out.println("\n🔄 [" + code + "] URL 수집 시작...");
//                    List<String> currentCategoryUrls = new ArrayList<>(); // 현재 카테고리용 리스트
//
//                    // A. 체크박스 세팅 (기존 것 끄고, 타겟만 켜기)
//                    List<WebElement> checkboxes = driver.findElements(By.name("prgmClsCdSh"));
//                    for (WebElement checkbox : checkboxes) {
//                        String value = checkbox.getAttribute("value");
//                        boolean isChecked = checkbox.isSelected();
//
//                        if (code.equals(value)) {
//                            // 내꺼면 -> 켜야 함 (꺼져있으면 클릭)
//                            if (!isChecked) executor.executeScript("arguments[0].click();", checkbox);
//                        } else {
//                            // 남의꺼면 -> 꺼야 함 (켜져있으면 클릭)
//                            if (isChecked) executor.executeScript("arguments[0].click();", checkbox);
//                        }
//                    }
//
//                    // B. 검색 실행 (리스트 갱신)
//                    try {
//                        driver.findElement(By.id("searchValue")).sendKeys(Keys.ENTER);
//                        Thread.sleep(2000); // 로딩 대기
//                    } catch (Exception e) {
//                        System.out.println("   ⚠️ 검색 실패");
//                    }
//
//                    // C. URL 추출
//                    List<WebElement> titleLinks = driver.findElements(By.cssSelector("a.tit.detailBtn"));
//                    for (WebElement link : titleLinks) {
//                        String params = link.getAttribute("data-params");
//                        if (params != null) {
//                            Pattern pattern = Pattern.compile("\"encSddpbSeq\":\"([^\"]+)\"");
//                            Matcher matcher = pattern.matcher(params);
//
//                            if (matcher.find()) {
//                                String id = matcher.group(1);
//                                // 💡 찾으신 정확한 URL 패턴
//                                String fullUrl = "https://path.ssu.ac.kr/ptfol/imng/icmpNsbjtPgm/findIcmpNsbjtPgmInfo.do?encSddpbSeq=" + id + "&paginationInfo.currentPageNo=1";
//                                try {
//                                    for (int page = 1; page <= MAX_PN; page++) {
//                                        System.out.println("   📄 현재 " + page + "페이지 수집 중...");
//                                        WebElement pageTwoBtn = driver.findElement(
//                                            By.linkText(String.valueOf(page)));
//                                        // 강제 클릭 (JS 사용)
//                                        ((JavascriptExecutor) driver).executeScript(
//                                            "arguments[0].click();", pageTwoBtn);
//
//                                        // 페이지 로딩 대기
//                                        Thread.sleep(2000);
//                                        System.out.println(" 페이지 이동 성공!");
//
//                                        //글들 url모아서 글들어가서 크롤링 하는거 넣으면됨.
//                                    }
//                                }
//                                catch (Exception e){
//
//                                }
//                                //currentCategoryUrls.add(fullUrl);
//                            }
//                        }
//                    }
//
////                    System.out.println("   📋 [" + code + "] 수집 개수: " + currentCategoryUrls.size());
////
////                    // D. 맵에 저장 (이 시점에 해당 카테고리 URL들이 저장됨)
////                    collectedData.put(code, currentCategoryUrls);
//
//                } // [반복문 끝]
//
//                // ==========================================
//                // 3. 결과 분배 (여기서 변수 3개로 나뉩니다)
//                // ==========================================
////                List<String> urlListPC01 = collectedData.getOrDefault("PC01", new ArrayList<>());
////                List<String> urlListPC02 = collectedData.getOrDefault("PC02", new ArrayList<>());
////                List<String> urlListPC04 = collectedData.getOrDefault("PC05", new ArrayList<>());
////
////                System.out.println("\n✅ [최종 결과 확인]");
////                System.out.println("PC01 (상담) URL 개수: " + urlListPC01.size());
////                System.out.println("PC02 (공모전) URL 개수: " + urlListPC02.size());
////                System.out.println("PC05 (기타) URL 개수: " + urlListPC04.size());
//
//                // 4. 이제 각 리스트별로 상세 페이지 크롤링 로직을 수행하면 됩니다.
//                // 예: processDetailCrawling(urlListPC01, "상담/멘토링");
//
//            } catch (Exception e) {
//                e.printStackTrace();
//            } finally {
//                // 눈으로 확인했으면 닫기 (주석 처리하면 브라우저 안 꺼짐)
//                //driver.quit();
//            }
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//    }
}