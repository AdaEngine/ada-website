//
//  Color+Extensions.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 05.05.2025.
//

import Ignite

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
