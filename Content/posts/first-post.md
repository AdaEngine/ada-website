---
date: 2020-04-03 19:22
description: Create your own NavigationViewStyle.
tags: SwiftUI, UI
image: vprusakov.jpg
keywords: custom navigationviewstyle navigationview style swiftui
---
# Custom NavigationView style

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
