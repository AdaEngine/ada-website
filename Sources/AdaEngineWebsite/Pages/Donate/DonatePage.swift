//
//  DonatePage.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 05.05.2025.
//

import Ignite

struct DonationMonthlyLevel {
    
    enum Benefits: String {
        case nameInCredits = "Name in Credits"
        case logoInCredits = "Logo in Credits"
        case linkInCredits = "Link in Credits"
        case supportByTeam = "Support by Team"
        case merch = "Merch"
    }
    
    var id: String {
        (self.name + self.link).hashValue.description
    }
    
    let name: String
    let icon: String
    let cost: String
    let benefits: [Benefits]
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
    
    var body: some HTML {
        Div {
            Grid(alignment: .top, spacing: 60) {
                VStack(alignment: .leading) {
                    Text("Support the future of AdaEngine")
                        .font(.primary(size: .px(74)))
                    
                    Text("""
                    Join the Development Fund and support our misson to develop and support 
                    the free and open source AdaEngine.
                    """)
                    .font(.lead)
                }
                .width(2)
                
                donatePicker()
                    .width(2)
            }
            .columns(4)
            
            Script(file: "/js/donation_card.js")
        }
    }
}

private extension DonatePage {
    
    enum SectionID: String {
        case usd
        case boosty
    }
    
    func donatePicker() -> some HTML {
        VStack {
            Text("Become a monthly member!")
                .font(.title3)
                .padding(.bottom, 10)
            
            Grid(spacing: 0) {
                Button {
                    "USD"
                } actions: {
                    HideElement(SectionID.boosty.rawValue)
                    ShowElement(SectionID.usd.rawValue)
                }
                .width(2)
                
                Button {
                    "Boosty"
                } actions: {
                    HideElement(SectionID.usd.rawValue)
                    ShowElement(SectionID.boosty.rawValue)
                }
                .width(2)
            }
            .columns(5)
            .padding(.vertical, 4)
            .frame(width: .percent(100%))
            .border(.white, width: 1.5, cornerRadii: .init(8))
            
            donateSection(levels: Self.monthlyUSDLevels)
                .id(SectionID.usd.rawValue)
            
            donateSection(levels: Self.monthlyBoostyLevels)
                .id(SectionID.boosty.rawValue)
                .hidden()
        }
    }
    
    func donateSection(levels: [DonationMonthlyLevel]) -> some HTML {
        VStack {
            VStack(alignment: .leading) {
                Grid(levels) { item in
                    Button {
                        item.cost
                    } actions: {
                        for level in levels {
                            HideElement(level.id)
                        }
                        
                        ShowElement(item.id)
                    }
                    .width(2)
                    .font(.primary(size: .px(15)))
                    .background(item.color)
                    .foregroundStyle(item.fontColor)
                    .cornerRadius(8)
                }
                .columns(6)
            }
            .padding(.bottom, 40)
            
            ForEach(levels.enumerated()) { (index, item) in
                VStack(spacing: 20) {
                    MontlhySponsorCard(item: item)
                    
                    Link("Donate", target: item.link)
                        .linkStyle(.button)
                        .padding(.horizontal, 40)
                        .font(.title4)
                }
                .id(item.id)
                .hidden(index != 0)
            }
        }
    }
}

extension DonatePage {
   static let monthlyUSDLevels: [DonationMonthlyLevel] = [
        .init(
            name: "Bronze",
            icon: "/images/ae_logo_white.svg",
            cost: "$5",
            benefits: [
                .nameInCredits
            ],
            color: "var(--color-donate-level-bronze-color)",
            isDark: false,
            link: "/"
        ),
        .init(
            name: "Silver",
            icon: "/images/ae_logo_white.svg",
            cost: "$10",
            benefits: [
                .nameInCredits
            ],
            color: "var(--color-donate-level-silver-color)",
            isDark: false,
            link: "/"
        ),
        .init(
            name: "Gold",
            icon: "/images/ae_logo_black.svg",
            cost: "$25",
            benefits: [
                .nameInCredits
            ],
            color: "var(--color-donate-level-gold-color)",
            isDark: true,
            link: "/"
        ),
        .init(
            name: "Platinum",
            icon: "/images/ae_logo_black.svg",
            cost: "$50",
            benefits: [
                .logoInCredits,
            ],
            color: "var(--color-donate-level-platinum-color)",
            isDark: true,
            link: "/"
        ),
        .init(
            name: "Titanium",
            icon: "/images/ae_logo_white.svg",
            cost: "$100",
            benefits: [
                .logoInCredits,
                .linkInCredits,
                .supportByTeam
            ],
            color: "var(--color-donate-level-titanium-color)",
            isDark: false,
            link: "/"
        ),
        .init(
            name: "Diamond",
            icon: "/images/ae_logo_black.svg",
            cost: "$250",
            benefits: [
                .logoInCredits,
                .linkInCredits,
                .supportByTeam
            ],
            color: "var(--color-donate-level-diamond-color)",
            isDark: true,
            link: "/"
        )
    ]
    
    static let monthlyBoostyLevels: [DonationMonthlyLevel] = [
         .init(
             name: "Bronze",
             icon: "/images/ae_logo_white.svg",
             cost: "350₽",
             benefits: [
                 .nameInCredits
             ],
             color: "var(--color-donate-level-bronze-color)",
             isDark: false,
             link: "https://boosty.to/adaengine/purchase/3179294?ssource=DIRECT&share=subscription_link"
         ),
         .init(
             name: "Silver",
             icon: "/images/ae_logo_white.svg",
             cost: "800₽",
             benefits: [
                 .nameInCredits
             ],
             color: "var(--color-donate-level-silver-color)",
             isDark: false,
             link: "https://boosty.to/adaengine/purchase/3179295?ssource=DIRECT&share=subscription_link"
         ),
         .init(
             name: "Gold",
             icon: "/images/ae_logo_black.svg",
             cost: "1500₽",
             benefits: [
                 .nameInCredits
             ],
             color: "var(--color-donate-level-gold-color)",
             isDark: true,
             link: "https://boosty.to/adaengine/purchase/3179293?ssource=DIRECT&share=subscription_link"
         ),
         .init(
             name: "Platinum",
             icon: "/images/ae_logo_black.svg",
             cost: "3500₽",
             benefits: [
                 .logoInCredits,
             ],
             color: "var(--color-donate-level-platinum-color)",
             isDark: true,
             link: "https://boosty.to/adaengine/purchase/3354083?ssource=DIRECT&share=subscription_link"
         ),
         .init(
             name: "Titanium",
             icon: "/images/ae_logo_white.svg",
             cost: "5000₽",
             benefits: [
                 .logoInCredits,
                 .linkInCredits,
                 .supportByTeam,
                 .merch
             ],
             color: "var(--color-donate-level-titanium-color)",
             isDark: false,
             link: "https://boosty.to/adaengine/purchase/3354084?ssource=DIRECT&share=subscription_link"
         ),
         .init(
             name: "Diamond",
             icon: "/images/ae_logo_black.svg",
             cost: "20000₽",
             benefits: [
                 .logoInCredits,
                 .linkInCredits,
                 .supportByTeam,
                 .merch
             ],
             color: "var(--color-donate-level-diamond-color)",
             isDark: true,
             link: "https://boosty.to/adaengine/purchase/3354085?ssource=DIRECT&share=subscription_link"
         )
     ]
}
