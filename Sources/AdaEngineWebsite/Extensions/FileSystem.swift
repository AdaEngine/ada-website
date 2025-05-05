//
//  FileSystem.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 05.05.2025.
//

import Foundation

enum FileSystemError: Error {
    case fileItemDoesntExists
    case failedToCreateFileItem
}

protocol FileSystemItem {
    var path: URL { get }
    
    func exists() -> Bool
    
    func delete() throws
}

extension FileSystemItem {
    func exists() -> Bool {
        FileManager.default.fileExists(atPath: path.path())
    }
    
    func delete() throws {
        try FileManager.default.removeItem(at: path)
    }
}

struct Folder: FileSystemItem {
    let path: URL
    
    func file(at name: String) -> File {
        let filePath = self.path.appending(path: name)
        return File(path: filePath)
    }
    
    @discardableResult
    func createFile(at path: String, contents: Data? = nil) throws -> File {
        let filePath = self.path.appending(path: path)
        let isCreated = FileManager.default.createFile(atPath: filePath.path(), contents: contents)
        
        if !isCreated {
            throw FileSystemError.failedToCreateFileItem
        }
        
        return File(path: filePath)
    }
    
    func containsFile(named: String) -> Bool {
        FileManager.default.fileExists(atPath: path.appending(path: named).path())
    }
}

struct File: FileSystemItem {
    let path: URL
    
    func write(_ string: String, encoding: String.Encoding = .utf8) throws {
        try string.write(to: path, atomically: true, encoding: encoding)
    }
    
    func write(_ content: Data) throws {
        try content.write(to: path)
    }
}

extension AdaEngineWebsiteContext {
    func folder(at path: String) throws -> Folder {
        let folderPath = self.rootURL.appending(path: path)
        let folder = Folder(path: folderPath)
        
        if !folder.exists() {
            throw FileSystemError.fileItemDoesntExists
        }
        
        return folder
    }
    
    func file(at path: String) throws -> File {
        let folderPath = self.rootURL.appending(path: path)
        let folder = File(path: folderPath)
        
        if !folder.exists() {
            throw FileSystemError.fileItemDoesntExists
        }
        
        return folder
    }
}
