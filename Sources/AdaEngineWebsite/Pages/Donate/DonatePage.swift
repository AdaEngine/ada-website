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
        
        var button: String {
            self.rawValue + "-btn"
        }
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
                .role(.default)
                .width(2)
                
                Button {
                    "Boosty"
                } actions: {
                    HideElement(SectionID.usd.rawValue)
                    ShowElement(SectionID.boosty.rawValue)
                }
                .role(.default)
                .width(2)
            }
            .columns(4)
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
