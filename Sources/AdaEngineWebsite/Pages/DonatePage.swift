//
//  DonatePage.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 05.05.2025.
//

import Ignite

struct DonationMonthlyLevel {
    
    var id: String {
        self.name.lowercased()
    }
    
    let name: String
    let icon: String
    let cost: String
    let benefits: [String]
    let color: String
    let isDark: Bool
    let link: String
    
    var fontColor: String {
        if isDark {
            "var(--glyph-gray-override)"
        } else {
            Color.white.description
        }
    }
}

struct DonatePage: StaticPage {
    let title: String = "Donate"
    
    let monthlyLevels: [DonationMonthlyLevel] = [
        .init(
            name: "Bronze",
            icon: "/images/ae_logo_white.svg",
            cost: "$5",
            benefits: [],
            color: "var(--color-donate-level-bronze-color)",
            isDark: false,
            link: ""
        ),
        .init(
            name: "Silver",
            icon: "/images/ae_logo_white.svg",
            cost: "$10",
            benefits: [],
            color: "var(--color-donate-level-silver-color)",
            isDark: false,
            link: ""
        ),
        .init(
            name: "Gold",
            icon: "/images/ae_logo_black.svg",
            cost: "$25",
            benefits: [],
            color: "var(--color-donate-level-gold-color)",
            isDark: true,
            link: ""
        ),
        .init(
            name: "Platinum",
            icon: "/images/ae_logo_black.svg",
            cost: "$50",
            benefits: [
                
            ],
            color: "var(--color-donate-level-platinum-color)",
            isDark: true,
            link: ""
        ),
        .init(
            name: "Titanium",
            icon: "/images/ae_logo_white.svg",
            cost: "$100",
            benefits: [
                
            ],
            color: "var(--color-donate-level-titanium-color)",
            isDark: false,
            link: ""
        ),
        .init(
            name: "Diamond",
            icon: "/images/ae_logo_black.svg",
            cost: "$250",
            benefits: [
                
            ],
            color: "var(--color-donate-level-diamond-color)",
            isDark: true,
            link: ""
        )
    ]
    
    var body: some HTML {
        Div {
            VStack(alignment: .leading, spacing: 40) {
                VStack {
                    Text("Support the future of AdaEngine")
                        .font(.primary(size: .px(74)))
                }
                
                donateSection()
            }
            
            Script(file: "/js/donation_card.js")
        }
    }
}

private extension DonatePage {
    func donateSection() -> some HTML {
        HStack(alignment: .top) {
            VStack(alignment: .leading) {
                Text("Become a member!")
                    .font(.title3)
                    .padding(.bottom, 20)
                
                Grid(self.monthlyLevels, spacing: 5) { item in
                    Button {
                        item.cost
                    } actions: {
                        for level in self.monthlyLevels {
                            HideElement(level.id)
                        }
                        
                        ShowElement(item.id)
                    }
                    .cornerRadius(8)
                }
                .columns(3)
            }
            
            ForEach(self.monthlyLevels.enumerated()) { (index, item) in
                MontlhySponsorCard(item: item)
                    .id(item.id)
                    .hidden(index != 0)
            }
        }
    }
}

struct MontlhySponsorCard: DocumentElement {
    let item: DonationMonthlyLevel
    
    var body: some HTML {
        VStack {
            Div {
                Div {
                    VStack(alignment: .leading) {
                        Div {
                            Image(decorative: item.icon)
                                .resizable()
                                .padding(.bottom, 20)
                        }
                        .margin(20)
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Span(item.name)
                            Span("member")
                        }
                            .font(.primary(size: .px(30)))
                        
                        HStack(alignment: .bottom) {
                            Text("Sponsor since 2025")
                            
                            Text("AdaEngine")
                                .font(.primary(size: .px(16)))
                        }
                        .padding(.top, 30)
                    }
                    .foregroundStyle(item.fontColor)
                    .frame(width: 270)
                    .cornerRadius(8)
                    .padding()
                    .background(item.color)
                    .overlay {
                        Div {}
                            .class("shineLayer")
                            .cornerRadius(8)
                    }
                    .class("cardBg")
                }
                .id(item.id)
                .textSelection(.none)
                .class("card")
            }
            .class("donation_card")
        }
    }
}
