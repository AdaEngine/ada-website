//
//  IgnitePlugins.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 02.05.2025.
//

import Ignite

protocol IgnitePlugin {
    func execute() async throws
}

struct PluginsExecutor {
    private var plugins: [any IgnitePlugin]
    
    init(plugins: [any IgnitePlugin] = []) {
        self.plugins = plugins
    }
    
    mutating func add<T: IgnitePlugin>(_ plugin: T) {
        self.plugins.append(plugin)
    }
    
    func execute() async throws {
        for plugin in plugins {
            try await plugin.execute()
        }
    }
}
