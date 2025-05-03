//
//  AEFooter.swift
//  
//
//  Created by v.prusakov on 4/9/23.
//

import Ignite

struct AEFooter: DocumentElement {
    var body: some HTML {
        Tag("footer") {
            Div {
                Text("Copyright © 2021-2023 Vladislav Prusakov. All rights reserved.")
                    .font(.body)
            }
            .class("footer-container content-restriction container")
        }
        .class("footer")
    }
}
