//
//  Author.swift
//  
//
//  Created by v.prusakov on 4/19/20.
//

struct AuthorDTO: Decodable {
    let name: String
    let avatar: String
    let description: String
    let username: String
    let socials: [Social]
    
    var html: String?
}
