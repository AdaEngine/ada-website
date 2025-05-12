//
//  DonateButton.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 05.05.2025.
//

import Ignite

struct DonateButton: DocumentElement {
    
    var isPrimitive: Bool = true
    
    var body: some HTML {
        Link(target: DonatePage()) {
            HStack(spacing: 2) {
                Text("Donate")
                
                Image(systemName: "heart-fill", description: "Heart")
                    .margin(0)
            }
            .horizontalAlignment(.center)
            .foregroundStyle(.white)
            .padding(7)
            .background("var(--donate)")
            .hoverEffect({ effect in
                effect
                    .background("var(--donate-darker)")
            })
            .cornerRadius(12)
            .class("navigation-item-link")
        }
    }
}
