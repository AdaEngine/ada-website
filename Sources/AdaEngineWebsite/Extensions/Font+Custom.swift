//
//  Font+Custom.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 05.05.2025.
//

import Ignite

extension Font {
    static func primary(
        style: Font.Style = .body,
        size: LengthUnit,
        weight: Font.Weight = .regular
    ) -> Font {
        Font.custom("Primary", style: style, size: size, weight: weight)
    }
}
