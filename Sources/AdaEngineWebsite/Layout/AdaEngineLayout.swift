//
//  AdaEngineLayout.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 02.05.2025.
//

import Ignite

struct AdaEngineLayout: Layout {
    
    @DocumentBuilder
    var body: some HTML {
        Head {
            MetaLink(href: "/styles/main.css", rel: .stylesheet)
            AnyHTML(safariMetaTags)
        }
        
        Body {
                AEHeader()
                content
                    .class("container content-restriction safe-area-insets")
                AEFooter()
                navigationBurger
        }
    }
}

private extension AdaEngineLayout {
    @HTMLBuilder
    var safariMetaTags: some HTML {
        MetaTag(name: "theme-color", content: "#FFFFFF")
            .attribute("media", "(prefers-color-scheme: light)")
        
        MetaTag(name: "theme-color", content: Color(red: 0, green: 0, blue: 0, opacity: 0.4).hexWithAlpha)
            .attribute("media", "(prefers-color-scheme: dark)")
    }
    
    var navigationBurger: some HTML {
        Script(code: """
            (function(){
                var burger = document.getElementsByClassName('burger-container')[0],
                    header = document.querySelector('header'); 
                burger.onclick = function() {
                    header.classList.toggle('menu-opened');
                }
            }());
        """)
    }
}

//private func makeHeaderMetaData() -> Node<HTML.DocumentContext> {
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
//    .group(
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
