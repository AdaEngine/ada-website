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
    var name: String { get }
    
    @MainActor func modify(_ markdown: inout String) throws
}

extension MarkdownModifier {
    var name: String {
        String(describing: Self.self)
    }
}

@DependencyClient
struct MarkdownModifierApplier {
    private let modifiers: [any MarkdownModifier]
    
    init(modifiers: [any MarkdownModifier]) {
        self.modifiers = modifiers
    }
    
    @MainActor
    func execute(to markdown: inout String) throws {
        try modifiers.forEach {
            print("🫦 Apply modifier: \($0.name)")
            try $0.modify(&markdown)
        }
    }
}

extension MarkdownModifierApplier: TestDependencyKey {
    static var testValue: MarkdownModifierApplier {
        MarkdownModifierApplier(modifiers: [])
    }
}
