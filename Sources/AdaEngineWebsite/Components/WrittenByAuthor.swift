//
//  WrittenByAuthor.swift
//  
//
//  Created by v.prusakov on 4/12/23.
//

import Dependencies
import Ignite

struct WrittenByAuthor: DocumentElement {
    
    let author: AuthorEntity
    
    @Dependency(\.context)
    private var context
    
    var body: some HTML {
        Div {
            Text("WRITTEN BY")
                .font(.title3)
            
            Div {
                AEImage(
                    path: self.author.avatar,
                    description: "\(self.author.name) Profile Picture"
                )
                .avatarModifier()
                
                Div {
                    Link(target: self.author.path) {
                        Text(self.author.name)
                            .font(.title2)
                    }
                      
                    SocialList(socials: self.author.socials)
                }
                .class("author_info")
            }
            .class("about_author_container")
        }
        .class("written_by")
    }
}
