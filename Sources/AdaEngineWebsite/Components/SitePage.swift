//
//  SitePage.swift
//  
//
//  Created by v.prusakov on 4/13/23.
//

import Publish
import Plot
import PublishColorUtils

///// Base wrapper entyer all web page. It's wrap you content to header and footer and set base page metadata
///// to your webpage like: keywords, analytics, styles and so on.
//struct SitePage<Content: Component> {
//    
//    let location: Location
//    var section: Blog.SectionID? = nil
//    let context: PublishingContext<Blog>
//    
//    var titleSeparator: String = " | "
//    var stylesheetPaths: [Path] = ["Styles/main.css"]
//    var rssFeedPath: Path? = .defaultForRSSFeed
//    var rssFeedTitle: String? = nil
//    var keywords: String? = nil
//    
//    @ComponentBuilder
//    var content: Content
//    
//    var html: HTML {
//        let component = PageLayout(section: self.section) { self.content }
//            .environmentValue(self.context, key: .publishContext)
//        
//        return HTML(
//            .lang(context.site.language),
//            self.makeHeaderMetaData(),
//            .body(
//                .component(component),
//                .navigationBurgerMenu()
//            )
//        )
//    }
//    
//    // MARK: - Private
//    
//    private func makeHeaderMetaData() -> Node<HTML.DocumentContext> {
//        var title = location.title
//        
//        if title.isEmpty {
//            title = context.site.name
//        } else {
//            title.append(titleSeparator + context.site.name)
//        }
//        
//        var description = location.description
//        
//        if description.isEmpty {
//            description = context.site.description
//        }
//        
//        return .head(
//            .encoding(.utf8),
//            .siteName(context.site.name),
//            .url(context.site.url(for: location)),
//            .title(title),
//            .description(description),
//            .twitterCardType(location.imagePath == nil ? .summary : .summaryLargeImage),
//            .forEach(stylesheetPaths, { .stylesheet($0) }),
//            .viewport(.accordingToDevice),
//            .favicon("Images/favicon.png"),
//            .safariTabColor(),
//            .unwrap(rssFeedPath, { path in
//                let title = rssFeedTitle ?? "Subscribe to \(context.site.name)"
//                return .rssFeedLink(path.absoluteString, title: title)
//            }),
//            .unwrap(location.imagePath ?? context.site.imagePath, { path in
//                let url = context.site.url(for: path)
//                return .socialImageLink(url)
//            }),
//            .unwrap(keywords, {
//                .meta(
//                    .name("keywords"),
//                    .content($0)
//                )
//            }),
//            .addAnalytics(for: location, on: context.site)
//        )
//    }
//}
//
//extension Node where Context == HTML.HeadContext {
//    static func addAnalytics(for location: Location, on site: Blog) -> Node {
//        .group(
//            .script(
//                .async(),
//                .src("https://www.googletagmanager.com/gtag/js?id=UA-73980658-4")
//            ),
//            .script(
//                .text(
//                    """
//                    window.dataLayer = window.dataLayer || [];
//                    function gtag(){dataLayer.push(arguments);}
//                    gtag('js', new Date());
//                    
//                    gtag('config', 'UA-73980658-4');
//                    """
//                )
//            )
//        )
//    }
//    
//    static func safariTabColor() -> Node {
//        .group(
//            .meta(
//                .name("theme-color"),
//                .content("#FFFFFF"),
//                .attribute(named: "media", value: "(prefers-color-scheme: light)")
//            ),
//            .meta(
//                .name("theme-color"),
//                .content(Color(red: 0, green: 0, blue: 0, alpha: 0.4).hexWithAlpha),
//                .attribute(named: "media", value: "(prefers-color-scheme: dark)")
//            )
//        )
//    }
//}
//
//extension Node where Context == HTML.BodyContext {
//    static func navigationBurgerMenu() -> Node {
//        .script(
//            .text("""
//            (function(){
//                var burger = document.getElementsByClassName('burger-container')[0],
//                    header = document.querySelector('header');
//                
//                burger.onclick = function() {
//                    header.classList.toggle('menu-opened');
//                }
//            }());
//            """)
//        )
//    }
//}
//
//extension EnvironmentKey where Value == PublishingContext<Blog>? {
//    static var publishContext: Self {
//        EnvironmentKey(defaultValue: nil)
//    }
//}
