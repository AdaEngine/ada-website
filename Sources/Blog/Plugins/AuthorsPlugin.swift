//
//  File.swift
//  
//
//  Created by v.prusakov on 4/15/20.
//

import Foundation
import Publish

struct Author: Decodable {
    let name: String
    let avatar: String
    let description: String
    let github: String
    
    var html: String?
}

struct AuthorItem: Equatable {
    let name: String
    let avatar: String
    let description: String
    let github: String
    let githubPath: Path
    
    var content: Content = Content()
    
    var path: Path = ""
    
    init(author: Author) {
        self.name = author.name
        self.avatar = author.avatar
        self.description = author.description
        self.github = author.github
        self.githubPath = "https://github.com/\(author.github)"
    }
}

extension Plugin where Site == Blog {
    
    static func authorsPlugin(resourceFolder: Path = "Resources") -> Self {
        Plugin(name: "Authors Plugin", installer: { context in
            let folder = try context.folder(at: resourceFolder)
            let file = try folder.file(at: "authors.json")
            
            let authors = try JSONDecoder().decode([Author].self, from: file.read())
            
            let parser = context.markdownParser
            context.allItems(sortedBy: \.date).forEach { item in
                guard var author = authors.first(where: { item.metadata.author == $0.github }).map(AuthorItem.init) else { return }
                
                let html = parser.html(from: author.description)
                author.content = Content(title: author.name, description: author.description, body: Content.Body(html: html), date: Date(), lastModified: Date(), imagePath: context.site.imagePath, audio: nil, video: nil)
                
                author.path = "authors/\(author.github)"
                Item.authors[item] = author
                
                let page = Page(path: author.path, content: author.content)
                Page.authors[page] = author
                context.addPage(page)
            }
        })
    }
    
}

extension PublishingContext where Site == Blog {
    func items<T: Comparable>(
        authoredBy author: AuthorItem,
        sortedBy sortingKeyPath: KeyPath<Item<Site>, T>,
        order: SortOrder = .ascending) -> [Item<Blog>] {
        return self.allItems(sortedBy: sortingKeyPath, order: order).filter { $0.author == author }
    }
}

extension Page: Hashable {
    
    public func hash(into hasher: inout Hasher) {
        hasher.combine(self.path)
        hasher.combine(self.content.title)
    }
    
    static var authors: [Page: AuthorItem] = [:]
    
    var author: AuthorItem? {
        return Self.authors[self]
    }
}

extension Item where Site == Blog {
    static var authors: [Item: AuthorItem] = [:]
    
    var author: AuthorItem {
        return Self.authors[self]!
    }
}
