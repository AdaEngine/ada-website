//
//  Socials.swift
//  
//
//  Created by v.prusakov on 4/19/20.
//

import Foundation
import Publish
import PublishColorUtils

extension Author {
    
    struct Social: Decodable, Equatable {
        let username: String
        let social: Kind
        
        var path: Path {
            self.social.url.appendingComponent(self.username)
        }
    }
    
}

extension Author.Social {
    enum Kind: String, Decodable, Equatable, CaseIterable {
        case twitter
        case github
        
        var url: Path {
            switch self {
            case .github:
                return "https://github.com/"
            case .twitter:
                return "https://twitter.com/"
            }
        }
        
        var logoPath: String {
            switch self {
            case .github:
                return "socials/github.svg"
            case .twitter:
                return "socials/twitter.svg"
            }
        }
        
        var backgroundColor: Color {
            switch self {
            case .github:
                return Color(hex: "#000000")
                    .adaptiveToDarkTheme(Color(hex: "#ffffff"))
            case .twitter:
                return Color(hex: "#00acee")
            }
        }
        
        var color: Color {
            switch self {
            case .github:
                return Color(hex: "#ffffff")
                    .adaptiveToDarkTheme(Color(hex: "#000000"))
            case .twitter:
                return Color(hex: "#ffffff")
            }
        }
    }
}
