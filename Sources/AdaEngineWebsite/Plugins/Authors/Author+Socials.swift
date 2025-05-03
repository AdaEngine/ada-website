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
                    .adaptiveToDarkTheme(Color(hex: "#ffffff"))
            case .twitter:
                return Color(hex: "#00acee")
                    .withoutMultiTheme()
            }
        }
        
        var color: MultiThemeColor {
            switch self {
            case .github:
                return Color(hex: "#ffffff")
                    .adaptiveToDarkTheme(Color(hex: "#000000"))
            case .twitter:
                return Color(hex: "#ffffff")
                    .withoutMultiTheme()
            }
        }
    }
}

extension Color {
    var hexWithAlpha: String {
        return String(
            format: "#%02X%02X%02X%02X",
            Int(self.red * 0xff),
            Int(self.green * 0xff),
            Int(self.blue * 0xff),
            Int(self.opacity * 0xff)
        )
    }
    
    func adaptiveToDarkTheme(_ darkColor: Color) -> MultiThemeColor {
        MultiThemeColor(light: self, dark: darkColor)
    }
    
    func withoutMultiTheme() -> MultiThemeColor {
        MultiThemeColor(light: self, dark: nil)
    }
}

struct MultiThemeColor {
    let light: Color
    let dark: Color?
}
