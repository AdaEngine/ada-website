//
//  MainPage.swift
//  
//
//  Created by v.prusakov on 4/15/23.
//

import Ignite

struct MainPage: StaticPage {
    
    let title = "Home"
    
    let items: [CommunitySocial] = [
        CommunitySocial(
            image: "vprusakov.jpg",
            title: "Data Driven",
            description: "AdaEngine build around custom Entity Component System. It's simple to use, fast, parallel and cache-friendly.",
            path: ""
        ),
        CommunitySocial(
            image: "vprusakov.jpg",
            title: "Extendable out of the box",
            description: "Manage your scene or render plugins to extend your game.",
            path: ""
        ),
        CommunitySocial(
            image: "vprusakov.jpg",
            title: "2D Renderer",
            description: "Supports real-time 2D rendering for your games and apps. Write your own shaders, materials and render pipelines or you Sprite Sheets and Sprite renderer instead.",
            path: ""
        ),
        CommunitySocial(
            image: "vprusakov.jpg",
            title: "2D Physics",
            description: "AdaEngine supports Box2D physics.",
            path: ""
        ),
        CommunitySocial(
            image: "vprusakov.jpg",
            title: "Render Graphs",
            description: "Construct your own render pipeline using powerful of render graphs.",
            path: ""
        ),
        CommunitySocial(
            image: "vprusakov.jpg",
            title: "Scenes",
            description: "Save and load game worlds into scenes, extend them and more.",
            path: ""
        ),
        CommunitySocial(
            image: "vprusakov.jpg",
            title: "Free and Open Source",
            description: "AdaEngine is 100% free for you. Licensed by MIT. Learn, modify or use.",
            path: ""
        )
    ]
    
    @HTMLBuilder
    var body: some HTML {
        header()
        
        Section {
            ForEach(items) { item in
                CommunitySocialRow(item: item)
            }
        }
        .class("collection-grid grid-two-columns feature-list")
    }
}

private extension MainPage {
    func header() -> some HTML {
        Group {
            Text("A simple and scalable Game Engine built in Swift.")
                .font(.title1)
            
            Group {
                AEImage(path: "header_ident.svg")
                
                AEImage(path: "ae_logo.png")
            }
        }
        .class("feature-why")
    }
}

struct AEImage: DocumentElement {
    
    let path: String
    
//    @EnvironmentValue(.publishContext)
//    private var context
    
    init(path: String) {
        self.path = path
    }
    
    var body: some HTML {
        Image(path)
    }
}
