//
//  AEImage.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 03.05.2025.
//

import Dependencies
import Ignite

struct AEImage: HTML {
    
    let path: String
    let description: String?
    
    var attributes: CoreAttributes {
        get { image.attributes }
        set { image.attributes = newValue }
    }
    
    var isPrimitive: Bool = true
    
    @Dependency(\.context)
    private var context
    
    private var image: Image
    
    init(path: String, description: String? = nil) {
        self.path = path
        self.description = description
        
        self.image = Image("/images/" + path, description: description)
    }
    
    var body: some HTML {
        image
    }
}
