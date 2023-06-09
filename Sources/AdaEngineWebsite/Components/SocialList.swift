//
//  SocialList.swift
//  
//
//  Created by v.prusakov on 4/13/23.
//

import Plot
import Publish

struct SocialList: Component {
    
    let socials: [Author.Social]
    
    @EnvironmentValue(.publishContext)
    private var context
    
    var body: Component {
        List(self.socials) { social in
            ListItem {
                Link(url: social.path.absoluteString) {
                    Div {
                        Image(
                            url: self.context!.site.imagePath!.appendingComponent(social.social.logoPath).absoluteString,
                            description: social.social.rawValue
                        )
                    }
                    
                    Span {
                        Text(social.username)
                    }
                }
            }
            .class(social.cssClass)
        }
        .class("socials")
    }
}
