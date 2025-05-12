//
//  SocialList.swift
//  
//
//  Created by v.prusakov on 4/13/23.
//

import Dependencies
import Ignite

struct SocialList: DocumentElement {
    
    let socials: [AuthorDTO.Social]
    
    @Dependency(\.context)
    private var context
    
    var body: some HTML {
        List(self.socials) { social in
            ListItem {
                Link(target: social.path) {
                    Div {
                        AEImage(path: social.social.logoPath, description: social.social.rawValue)
                    }
                    
                    Span {
                        social.username
                    }
                }
            }
            .class(social.cssClass)
        }
        .class("socials")
    }
}
