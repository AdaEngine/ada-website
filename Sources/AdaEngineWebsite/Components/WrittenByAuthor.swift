//
//  WrittenByAuthor.swift
//  
//
//  Created by v.prusakov on 4/12/23.
//

import Plot
import Publish

struct WrittenByAuthor: Component {
    
    let author: AuthorItem
    
    @EnvironmentValue(.publishContext)
    private var context
    
    var body: Component {
        Div {
            H3("WRITTEN BY")
            
            Div {
                Image(
                    url: self.context!.site.imagePath!.appendingComponent(self.author.avatar).absoluteString,
                    description: "\(self.author.name) Profile Picture"
                )
                .class("avatar")
                
                Div {
                    Link(url: self.author.path.absoluteString) {
                        H2(self.author.name)
                    }
                    
                    self.author.content.body
                    
                    SocialList(socials: self.author.socials)
                }
                .class("author_info")
            }
            .class("about_author_container")
        }
        .class("written_by")
    }
}
