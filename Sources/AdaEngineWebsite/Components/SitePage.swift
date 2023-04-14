//
//  SitePage.swift
//  
//
//  Created by v.prusakov on 4/13/23.
//

import Publish
import Plot

/// Base wrapper entyer all web page. It's wrap you content to header and footer and set base page metadata
/// to your webpage like: keywords, analytics, styles and so on.
struct SitePage<Content: Component> {
    
    let location: Location
    var section: Blog.SectionID? = nil
    let context: PublishingContext<Blog>
    
    var titleSeparator: String = " | "
    var stylesheetPaths: [Path] = ["/main.css"]
    var rssFeedPath: Path? = .defaultForRSSFeed
    var rssFeedTitle: String? = nil
    var keywords: String? = nil
    
    @ComponentBuilder
    var content: Content
    
    var html: HTML {
        HTML(
            .lang(context.site.language),
            
            self.makeHeaderMetaData(),
            
                .body(
                    .component(
                        PageLayout(section: self.section) {
                            self.content
                        }
                            .environmentValue(context, key: .publishContext)
                    )
                )
        )
    }
    
    // MARK: - Private
    
    private func makeHeaderMetaData() -> Node<HTML.DocumentContext> {
        var title = location.title
        
        if title.isEmpty {
            title = context.site.name
        } else {
            title.append(titleSeparator + context.site.name)
        }
        
        var description = location.description
        
        if description.isEmpty {
            description = context.site.description
        }
        
        return .head(
            .encoding(.utf8),
            .siteName(context.site.name),
            .url(context.site.url(for: location)),
            .title(title),
            .description(description),
            .twitterCardType(location.imagePath == nil ? .summary : .summaryLargeImage),
            .forEach(stylesheetPaths, { .stylesheet($0) }),
            .viewport(.accordingToDevice),
            .unwrap(context.site.favicon, { .favicon($0) }),
            .unwrap(rssFeedPath, { path in
                let title = rssFeedTitle ?? "Subscribe to \(context.site.name)"
                return .rssFeedLink(path.absoluteString, title: title)
            }),
            .unwrap(location.imagePath ?? context.site.imagePath, { path in
                let url = context.site.url(for: path)
                return .socialImageLink(url)
            }),
            .unwrap(keywords, {
                .meta(
                    .name("keywords"),
                    .content($0)
                )
            }),
            .addAnalytics(for: location, on: context.site)
        )
    }
}

extension Node where Context == HTML.HeadContext {
    static func addAnalytics(for location: Location, on site: Blog) -> Node {
        .group(
            .script(
                .async(),
                .src("https://www.googletagmanager.com/gtag/js?id=UA-73980658-4")
            ),
            .script(
                .text(
                    """
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    
                    gtag('config', 'UA-73980658-4');
                    """
                )
            )
        )
    }
}

extension EnvironmentKey where Value == PublishingContext<Blog>? {
    static var publishContext: Self {
        EnvironmentKey(defaultValue: nil)
    }
}

extension Node where Context == HTML.DocumentContext {
    static func head(
        for location: Location,
        on site: Blog,
        titleSeparator: String = " | ",
        stylesheetPaths: [Path] = ["/main.css"],
        rssFeedPath: Path? = .defaultForRSSFeed,
        rssFeedTitle: String? = nil,
        keywords: String? = nil
    ) -> Node {
        var title = location.title
        
        if title.isEmpty {
            title = site.name
        } else {
            title.append(titleSeparator + site.name)
        }
        
        var description = location.description
        
        if description.isEmpty {
            description = site.description
        }
        
        return .head(
            .encoding(.utf8),
            .siteName(site.name),
            .url(site.url(for: location)),
            .title(title),
            .description(description),
            .twitterCardType(location.imagePath == nil ? .summary : .summaryLargeImage),
            .forEach(stylesheetPaths, { .stylesheet($0) }),
            .viewport(.accordingToDevice),
            .unwrap(site.favicon, { .favicon($0) }),
            .unwrap(rssFeedPath, { path in
                let title = rssFeedTitle ?? "Subscribe to \(site.name)"
                return .rssFeedLink(path.absoluteString, title: title)
            }),
            .unwrap(location.imagePath ?? site.imagePath, { path in
                let url = site.url(for: path)
                return .socialImageLink(url)
            }),
            .unwrap(keywords, {
                .meta(
                    .name("keywords"),
                    .content($0)
                )
            }),
            .addAnalytics(for: location, on: site)
        )
    }
}
