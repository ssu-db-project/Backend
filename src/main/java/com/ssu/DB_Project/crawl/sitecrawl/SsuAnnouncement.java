package com.ssu.DB_Project.crawl.sitecrawl;

import com.ssu.DB_Project.announcement.domain.Announcement;
import com.ssu.DB_Project.announcement.dto.AnnouncementProcessRequest;
import com.ssu.DB_Project.announcement.repository.AnnouncementRepository;
import com.ssu.DB_Project.announcement.service.AnnouncementService;
import io.github.bonigarcia.wdm.WebDriverManager;
import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SsuAnnouncement implements SiteCrawler {

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementService announcementService;
    @Getter
    @RequiredArgsConstructor
    private enum CategoryUrl {
        ACADEMIC("학사", "https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?category=%ED%95%99%EC%82%AC&keyword"),
        SCHOLARSHIP("장학", "https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?category=%EC%9E%A5%ED%95%99&keyword"),
        INTERNATIONAL("국제교류", "https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?category=%EA%B5%AD%EC%A0%9C%EA%B5%90%EB%A5%98&keyword"),
        INTERNATIONALSTUDENT("외국인 유학생","https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?category=%EC%99%B8%EA%B5%AD%EC%9D%B8%EC%9C%A0%ED%95%99%EC%83%9D&keyword"),
        RECRUIT("채용","https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?category=%EC%B1%84%EC%9A%A9&keyword"),
        EVENT("기타","https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?category=%EA%B8%B0%ED%83%80&keyword" ),
        VOLUNTEER("봉사", "https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?category=%EB%B4%89%EC%82%AC&keyword");

        private final String korName; // DB 저장용 카테고리 이름
        private final String url;     // 접속 URL
    }
    // 기본 URL
    private static final String BASE_URL = "https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/";

    // 💡 몇 페이지까지 긁을지 설정 (테스트 땐 2~3, 실제론 10 등등)
    private static final int MAX_PAGE = 1;

    @Override
    public void crawl() {
        System.out.println("🚀 [" + getSiteName() + "] Selenium 크롤링 시작 (1~" + MAX_PAGE + "페이지)");

        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--remote-allow-origins=*");

        WebDriver driver = new ChromeDriver(options);

        try {
            // 카테고리 반복문
            for (CategoryUrl categoryEnum : CategoryUrl.values()) {
                // 페이지 반복문
                for (int page = 1; page <= MAX_PAGE; page++) {

                    // URL
                    String currentUrl = (page == 1) ? categoryEnum.getUrl()
                        : categoryEnum.getUrl() + "page/" + page + "/";

                    System.out.println("\nAvailable... " + page + "페이지 접근 중: " + currentUrl);
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
                            // A. 제목 링크가 없는 줄(빈 줄)은 건너뛰기
                            List<WebElement> linkTags = row.findElements(
                                By.cssSelector(".notice_col3 a"));
                            if (linkTags.isEmpty())
                                continue;

                            WebElement linkTag = linkTags.get(0);

                            // B. 날짜 (숨겨진 요소 대응)
                            String date = "";
                            try {
                                date = row.findElement(By.cssSelector(".notice_col1"))
                                    .getAttribute("innerText").trim();
                            } catch (Exception e) {
                                date = "날짜미상";
                            }

                            // C. 상태 (태그 없으면 '일반')
                            String status = "일반";
                            try {
                                status = row.findElement(By.cssSelector(".notice_col2 .tag"))
                                    .getText();
                            } catch (Exception ignored) {
                            }

                            // D. 부서
                            String dept = "숭실대";
                            try {
                                dept = row.findElement(By.cssSelector(".notice_col4")).getText();
                            } catch (Exception ignored) {
                            }

                            // 공지 카테고리 필드
                            String category = "기타"; // 태그가 없을 경우 기본값
                            try {
                                // .notice_col3 안에 있는 .label 클래스를 찾음
                                category = row.findElement(By.cssSelector(".notice_col3 .label"))
                                    .getText().trim();
                            } catch (Exception ignored) {
                                // 라벨이 없는 글도 있을 수 있으므로 예외 처리 (기본값 사용)
                            }

                            // E. 제목 및 링크
                            String url = linkTag.getAttribute("href");
                            String title = linkTag.getText().trim();

                            if (title.isEmpty()) {
                                title = linkTag.getAttribute("innerText").trim();
                            }
                            title = title.replace("\n", " ").replaceAll("\\s+", " ");

                            // F. 리스트에 추가 (중요!)
                            targets.add(new CrawlTarget(title, url, date, status, dept, category));

                        } catch (Exception e) {
                            System.out.println("❌ 목록 파싱 에러 (건너뜀): " + e.getMessage());
                        }
                    }

                    System.out.println("📋 " + page + "페이지 수집 대상: " + targets.size() + "개");

                    // --------------------------------------
                    // [2단계] 상세 페이지 접속 및 DB 저장
                    // --------------------------------------
                    // --------------------------------------
                    for (CrawlTarget target : targets) {
                        if (announcementRepository.existsByUrl(target.url)) {
                            System.out.println("PASS (이미 존재): " + target.title);
                            continue;
                        }

                        try {
                            driver.get(target.url);
                            Thread.sleep(600);

                            // 1. 본문 긁기
                            String contentBody = "";
                            try {
                                // CSS Selector 수정: .div (오타) -> div 또는 .bg-white
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

                            // 2. 첨부파일 추출 (DB용 리스트 + AI용 텍스트 동시 생성)
                            List<AnnouncementProcessRequest.FileDto> dbFileList = new ArrayList<>(); // DB 저장용
                            List<String> aiFileStrings = new ArrayList<>(); // AI 본문 삽입용

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
                                        // A. DB 저장용 DTO 담기
                                        dbFileList.add(
                                            new AnnouncementProcessRequest.FileDto(fileName,
                                                fileUrl));

                                        // B. AI용 문자열 담기
                                        aiFileStrings.add("[" + fileName + "](" + fileUrl + ")");

                                        System.out.println("   📂 파일 발견: " + fileName);
                                    }
                                }
                            } catch (Exception e) {
                                System.out.println("   ⚠️ 첨부파일 없음");
                            }

                            // 3. [핵심] 파일 리스트를 줄바꿈 문자열로 변환
                            String attachmentText = aiFileStrings.isEmpty() ? "없음"
                                : String.join("\n", aiFileStrings);

                            // 4. fullContent에 첨부파일 영역 추가
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
                                target.dept, // 부서 이름(source)입니다
                                target.title,
                                target.url,
                                attachmentText, // 💡 여기에 합쳐진 파일 문자열이 들어감!
                                contentBody
                            );

                            System.out.println("Analyze & Save... " + target.title);

                            // 5. 서비스 호출
                            AnnouncementProcessRequest request = new AnnouncementProcessRequest(
                                fullContent,
                                target.url,
                                target.category,
                                target.dept,
                                dbFileList        // DB 저장용 파일 리스트 전달
                            );
                            announcementService.processAndSave(request);
                        } catch (Exception e) {
                            System.err.println(
                                "❌ 상세 처리 실패 (" + target.title + "): " + e.getMessage());
                        }
                    }
                    // 페이지 넘어가기 전 잠깐 휴식
                    Thread.sleep(1000);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (driver != null) driver.quit();
            System.out.println("✅ [" + getSiteName() + "] 모든 크롤링 완료!");
        }
    }

    @Override
    public String getSiteName() {
        return "숭실대 스캐치";
    }

    record CrawlTarget(String title, String url, String date, String status, String dept, String category) {}
}