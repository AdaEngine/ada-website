//
//  HTML+Extensions.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 05.05.2025.
//

import Ignite

typealias Div = Section

extension HTML {
    func avatarModifier() -> some HTML {
        self.class("avatar")
    }
}
