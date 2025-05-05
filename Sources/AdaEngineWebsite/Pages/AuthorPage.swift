//
//  AuthorPage.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 05.05.2025.
//

import Dependencies
import Ignite

struct AuthorPage: StaticPage {
    var title: String
    var path: String
    
    let author: AuthorEntity
    
    @Environment(\.articles)
    private var articles
    
    @Dependency(\.context)
    private var context
    
    init(author: AuthorEntity) {
        self.title = author.username
        self.path = author.path
        self.author = author
    }
    
    var body: some HTML {
        VStack {
            HStack {
                Image(context.image(for: author.avatar)!)
                    .frame(width: 48, height: 48)
                    .avatarModifier()
                
                Text(author.name)
                    .font(.title1)
                Text(author.description)
            }
            
            
            Section("Posts") {
                ForEach(articles.items(authoredBy: self.author)) { item in
                    ArticlePreview(for: item)
                }
            }
        }
    }
}
