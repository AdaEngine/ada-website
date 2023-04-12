//
//  File.swift
//  
//
//  Created by v.prusakov on 4/9/23.
//

import Plot
import Publish

struct AEHeader: Component {
    
    @EnvironmentValue(.publishContext) var context
    
    var body: Component {
        Header {
            Div {
                Link(url: "/") {
                    H2(context!.site.name)
                    
                    H2("Blog")
                        .class("subtitle")
                }
                .class("header-logo")
            }
            .class("container content-restriction header-container")
        }
        .class("header")
    }
}
