//
//  File.swift
//  
//
//  Created by v.prusakov on 4/9/23.
//

import Publish
import Plot

struct AEFooter: Component {
    var body: Component {
        Footer {
            Div {
                Paragraph("Copyright © 2023 Vladislav Prusakov. All rights reserved.")
            }
            .class("footer-container content-restriction container")
        }
        .class("footer")
    }
}
