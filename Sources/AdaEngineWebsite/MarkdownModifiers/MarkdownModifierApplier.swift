//
//  MarkdownModifierApplier.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 02.05.2025.
//

import Dependencies
import DependenciesMacros
import Ignite

protocol MarkdownModifier {
    @MainActor func modifyMarkdown(_ markdown: inout String)
}

@DependencyClient
struct MarkdownModifierApplier {
    private let modifiers: [any MarkdownModifier]
    
    init(modifiers: [any MarkdownModifier]) {
        self.modifiers = modifiers
    }
    
    @MainActor
    func execute(to markdown: inout String) throws {
        modifiers.forEach {
            $0.modifyMarkdown(&markdown)
        }
    }
}

extension MarkdownModifierApplier: TestDependencyKey {
    static var testValue: MarkdownModifierApplier {
        MarkdownModifierApplier(modifiers: [])
    }
}
