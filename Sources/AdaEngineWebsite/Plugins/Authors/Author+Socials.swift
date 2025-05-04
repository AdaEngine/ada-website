//
//  Socials.swift
//  
//
//  Created by v.prusakov on 4/19/20.
//

import Foundation
import Ignite

extension AuthorDTO {
    struct Social: Decodable, Equatable {
        let username: String
        let social: Kind
        
        var path: String {
            self.social.url.appending(self.username)
        }
    }
}

extension AuthorDTO.Social {
    enum Kind: String, Decodable, Equatable, CaseIterable {
        case twitter
        case github
        
        var url: String {
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
        
        var backgroundColor: MultiThemeColor {
            switch self {
            case .github:
                return Color(hex: "#000000")
                    .adaptiveToDarkTheme(Color(hex: "#FFFFFF"))
            case .twitter:
                return Color(hex: "#00ACEE")
                    .withoutMultiTheme()
            }
        }
        
        var color: MultiThemeColor {
            switch self {
            case .github:
                return Color(hex: "#FFFFFF")
                    .adaptiveToDarkTheme(Color(hex: "#000000"))
            case .twitter:
                return Color(hex: "#FFFFFF")
                    .withoutMultiTheme()
            }
        }
    }
}

extension Color {
    var hexWithAlpha: String {
        return String(
            format: "#%02X%02X%02X%02X",
            self.red,
            self.green,
            self.blue,
            self.opacity
        )
    }
    
    func adaptiveToDarkTheme(_ darkColor: Color) -> MultiThemeColor {
        MultiThemeColor(light: self, dark: darkColor)
    }
    
    func withoutMultiTheme() -> MultiThemeColor {
        MultiThemeColor(light: self, dark: self)
    }
}

struct MultiThemeColor {
    let light: Color
    let dark: Color?
}
