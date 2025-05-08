---
date: 2020-04-05
description: Some Test Post
tags: AdaEngine, UI
image: news/1*eHvKZaNy4zaU76Tu6TSKWw.png
keywords: adaengine release 0.1
author: SpectralDragon
---
# Custom NavigationView style 1

![Some image](/Images/news/1*eHvKZaNy4zaU76Tu6TSKWw.png?fullWidth)

Hello everybody, today we will talk about custom NavigationViewStyle.

```swift
import SwiftUI

struct ContentView: View {
    
    @State var kek: String = "KEEEEK"
    
    var body: some View {
        NavigationView {
            Text("some text")
        }
        .navigationViewStyle(DefaultNavigationViewStyle())
    }
}
```
If we'll look into documentationm we doesn't see any method in protocol `NavigationViewStyle`, but if we implemented this method in class 

> Some interresting thing

<warning>

Some shits happend tho

```swift
import SwiftUI

struct ContentView: View {
    
    @State var kek: String = "KEEEEK"
    
    var body: some View {
        NavigationView {
            Text("some text")
        }
        .navigationViewStyle(DefaultNavigationViewStyle())
        
        if some != lol {
            print("kek")
        }
    }
    
    func someFunc() => String {
        return "SOME BIG TEXT"
    }
}
```
</warning>

<error>
    Some warning text
    some shit and etc other
</error>

<info>
Some info `information`
</info>
