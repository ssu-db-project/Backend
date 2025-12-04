package com.ssu.DB_Project.crawl.sitecrawl;

import com.ssu.DB_Project.announcement.dto.AnnouncementProcessRequest;
import com.ssu.DB_Project.announcement.repository.AnnouncementRepository;
import com.ssu.DB_Project.announcement.service.AnnouncementService;
import io.github.bonigarcia.wdm.WebDriverManager;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SsuAnnouncement implements SiteCrawler {

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementService announcementService;

    // 숭실대 공지사항 전체 목록 URL
    private static final String BASE_URL = "https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/";

    // 💡 전체 목록에서 긁을 페이지 수 (현재: 최신글 2페이지 분량)
    private static final int MAX_PAGE = 2;

    @Override
    public void crawl() {
        System.out.println("🚀 [" + getSiteName() + "] 전체 공지사항 크롤링 시작 (1~" + MAX_PAGE + "페이지)");

        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--remote-allow-origins=*");

        WebDriver driver = new ChromeDriver(options);

        try {
            // [변경] 카테고리 반복문 제거 -> 페이지 반복문만 실행
            for (int page = 1; page <= MAX_PAGE; page++) {

                // URL 설정: 1페이지는 기본 URL, 2페이지부터는 page/n/ 경로 사용
                String currentUrl;
                if (page == 1) {
                    currentUrl = BASE_URL;
                } else {
                    currentUrl = BASE_URL + "page/" + page + "/";
                }

                System.out.println("\nAvailable... 전체 목록 " + page + "페이지 접근 중: " + currentUrl);
                driver.get(currentUrl);
                driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(3));

                // --------------------------------------
                // [1단계] 목록 정보 안전하게 수집
                // --------------------------------------
                List<CrawlTarget> targets = new ArrayList<>();
                List<WebElement> rows = driver.findElements(
                        By.cssSelector("ul.notice-lists > li:not(.notice.head)"));

                if (rows.isEmpty()) {
                    System.out.println("⚠️ 더 이상 공지사항이 없습니다. (종료)");
                    break;
                }

                for (WebElement row : rows) {
                    try {
                        // A. 제목 링크 확인
                        List<WebElement> linkTags = row.findElements(
                                By.cssSelector(".notice_col3 a"));
                        if (linkTags.isEmpty())
                            continue;

                        WebElement linkTag = linkTags.get(0);

                        // B. 날짜 추출
                        String date = "날짜미상";
                        try {
                            date = row.findElement(By.cssSelector(".notice_col1"))
                                    .getAttribute("innerText").trim();
                        } catch (Exception ignored) {
                        }

                        // C. 상태(태그) 추출
                        String status = "일반";
                        try {
                            status = row.findElement(By.cssSelector(".notice_col2 .tag"))
                                    .getText();
                        } catch (Exception ignored) {
                        }

                        // D. 부서 추출
                        String dept = "숭실대";
                        try {
                            dept = row.findElement(By.cssSelector(".notice_col4")).getText();
                        } catch (Exception ignored) {
                        }

                        // E. 카테고리 추출 (화면의 라벨 텍스트 사용, 예: [학사], [장학])
                        String category = "기타";
                        try {
                            category = row.findElement(By.cssSelector(".notice_col3 .label"))
                                    .getText().trim();
                        } catch (Exception ignored) {
                            // 라벨이 없으면 기본값 유지
                        }

                        // F. 제목 및 링크 추출
                        String url = linkTag.getAttribute("href");
                        String title = linkTag.getText().trim();

                        if (title.isEmpty()) {
                            title = linkTag.getAttribute("innerText").trim();
                        }
                        title = title.replace("\n", " ").replaceAll("\\s+", " ");

                        // 리스트에 추가
                        targets.add(new CrawlTarget(title, url, date, status, dept, category));

                    } catch (Exception e) {
                        System.out.println("❌ 목록 파싱 에러 (건너뜀): " + e.getMessage());
                    }
                }

                System.out.println("📋 " + page + "페이지 수집 대상: " + targets.size() + "개");

                // --------------------------------------
                // [2단계] 상세 페이지 접속 및 DB 저장
                // --------------------------------------
                for (CrawlTarget target : targets) {
                    if (announcementRepository.existsByUrl(target.url)) {
                        System.out.println("PASS (이미 존재): " + target.title);
                        continue;
                    }

                    try {
                        driver.get(target.url);
                        Thread.sleep(600); // 서버 부하 방지 딜레이

                        // 1. 본문 긁기
                        String contentBody = "";
                        try {
                            contentBody = driver.findElement(
                                    By.cssSelector("div.bg-white.p-4.mb-5")).getText();
                        } catch (Exception e) {
                            try {
                                contentBody = driver.findElement(
                                        By.cssSelector(".bg-white.p-4")).getText();
                            } catch (Exception e2) {
                                contentBody = driver.findElement(By.tagName("body")).getText();
                            }
                        }

                        // 2. 첨부파일 추출
                        List<AnnouncementProcessRequest.FileDto> dbFileList = new ArrayList<>();
                        List<String> aiFileStrings = new ArrayList<>();

                        try {
                            List<WebElement> downloadLinks = driver.findElements(
                                    By.cssSelector("ul.download-list li a"));

                            for (WebElement link : downloadLinks) {
                                String fileUrl = link.getAttribute("href");
                                String fileName = "";
                                try {
                                    fileName = link.findElement(By.tagName("span")).getText()
                                            .trim();
                                } catch (Exception e) {
                                    fileName = link.getText().trim();
                                }

                                if (fileUrl != null && !fileUrl.isEmpty()) {
                                    dbFileList.add(
                                            new AnnouncementProcessRequest.FileDto(fileName, fileUrl));
                                    aiFileStrings.add("[" + fileName + "](" + fileUrl + ")");
                                    System.out.println("   📂 파일 발견: " + fileName);
                                }
                            }
                        } catch (Exception e) {
                            System.out.println("   ⚠️ 첨부파일 없음");
                        }

                        String attachmentText = aiFileStrings.isEmpty() ? "없음"
                                : String.join("\n", aiFileStrings);

                        // 3. 통합 본문 생성
                        String fullContent = String.format("""
                                [메타데이터]
                                카테고리: %s
                                작성일: %s
                                상태: %s
                                등록부서: %s
                                제목: %s
                                url: %s
                                [첨부파일]
                                %s
                                                            
                                [본문 내용]
                                %s
                                """,
                                target.category,
                                target.date,
                                target.status,
                                target.dept,
                                target.title,
                                target.url,
                                attachmentText,
                                contentBody
                        );

                        System.out.println("Analyze & Save... " + target.title);

                        // 4. 서비스 호출
                        AnnouncementProcessRequest request = new AnnouncementProcessRequest(
                                fullContent,
                                target.url,
                                target.category, // 화면에서 파싱한 카테고리(학사, 장학 등)가 들어갑니다.
                                target.dept,
                                dbFileList
                        );
                        announcementService.processAndSave(request);

                    } catch (Exception e) {
                        System.err.println(
                                "❌ 상세 처리 실패 (" + target.title + "): " + e.getMessage());
                    }
                }
                // 페이지 넘어가기 전 대기
                Thread.sleep(1000);
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (driver != null) {
                driver.quit();
            }
            System.out.println("✅ [" + getSiteName() + "] 모든 크롤링 완료!");
        }
    }

    @Override
    public String getSiteName() {
        return "숭실대 스캐치(전체)";
    }

    record CrawlTarget(String title, String url, String date, String status, String dept,
                       String category) {
    }
}