//
//  CopyResourcePlugin.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 29.04.2025.
//

import Dependencies
import Foundation
import Ignite

struct CopyResourcePlugin: IgnitePlugin {
    
    private var rootDir: StaticString
    let fromPath: String
    let toPath: String
    let includingSubdirectories: Bool
    
    @Dependency(\.context) private var context
    
    init(
        rootDirictory: StaticString = #filePath,
        from fromPath: String,
        to toPath: String = "Build",
        includingSubdirectories: Bool = false
    ) {
        self.rootDir = rootDirictory
        self.fromPath = fromPath
        self.toPath = toPath
        self.includingSubdirectories = includingSubdirectories
    }
    
    func execute() async throws {
        let rootURL = context.rootURL
        let fromURL = rootURL.appending(path: fromPath)
        let toURL = rootURL.appending(path: toPath)
        try copyItemsRecursivly(from: fromURL, to: toURL)
    }
}

extension CopyResourcePlugin {
    private func copyItemsRecursivly(from fromURL: URL, to toURL: URL) throws {
        var isDir: ObjCBool = false
        guard FileManager.default.fileExists(atPath: fromURL.path(), isDirectory: &isDir) else {
            print("File doesn't exists at path", fromURL.path())
            return
        }
        
        if isDir.boolValue {
            let items = try FileManager.default.contentsOfDirectory(atPath: fromURL.path())
            for item in items {
                if item.hasPrefix(".DS_Store") {
                    continue
                }
                
                try copyItemsRecursivly(
                    from: fromURL.appending(path: item),
                    to: toURL.appending(path: item)
                )
            }
        } else {
            let destinationDirectory = toURL.deletingLastPathComponent()
            try FileManager.default.createDirectory(at: destinationDirectory, withIntermediateDirectories: true)
            
            if FileManager.default.fileExists(atPath: toURL.path()) {
                try FileManager.default.removeItem(at: toURL)
            }
            try FileManager.default.copyItem(at: fromURL, to: toURL)
        }
    }
}
