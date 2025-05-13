//
//  DonatePage.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 05.05.2025.
//

import Ignite

struct DonatePage: StaticPage {
    
    let title: String = "Donate"
    
    var body: some HTML {
        Div {
            Grid(alignment: .top, spacing: 60) {
                VStack(alignment: .leading, spacing: 30) {
                    Text("Support the future of AdaEngine")
                        .class("donate-title")
                        .lineSpacing(1.2)
                    
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
        case oneTime
        var button: String {
            self.rawValue + "-btn"
        }
    }
    
    func donatePicker() -> some HTML {
        VStack {
            Text("Become a monthly member!")
                .font(.title3)
                .padding(.bottom, 10)
            
            Div {
                Button {
                    "USD"
                } actions: {
                    HideElement(SectionID.boosty.rawValue)
                    HideElement(SectionID.oneTime.rawValue)
                    ShowElement(SectionID.usd.rawValue)
                    SetClassAction(SectionID.usd.button, "active")
                    RemoveClassAction(SectionID.boosty.button, "active")
                    RemoveClassAction(SectionID.oneTime.button, "active")
                }
                .id(SectionID.usd.button)
                .active()
                
                Button {
                    "RUB"
                } actions: {
                    HideElement(SectionID.usd.rawValue)
                    HideElement(SectionID.oneTime.rawValue)
                    ShowElement(SectionID.boosty.rawValue)
                    RemoveClassAction(SectionID.usd.button, "active")
                    SetClassAction(SectionID.boosty.button, "active")
                    RemoveClassAction(SectionID.oneTime.button, "active")
                }
                .id(SectionID.boosty.button)

                Button {
                    "One time donation"
                } actions: {
                    HideElement(SectionID.usd.rawValue)
                    HideElement(SectionID.boosty.rawValue)
                    ShowElement(SectionID.oneTime.rawValue) 
                    RemoveClassAction(SectionID.usd.button, "active")
                    RemoveClassAction(SectionID.boosty.button, "active")
                    SetClassAction(SectionID.oneTime.button, "active")
                }
                .id(SectionID.oneTime.button)
            }
            .class("segment-control")
            .padding(.vertical, 4)
            .frame(width: .percent(100%))
            
            donateSection(levels: Self.monthlyLevels(isUSD: true))
                .id(SectionID.usd.rawValue)
            
            donateSection(levels: Self.monthlyLevels(isUSD: false))
                .id(SectionID.boosty.rawValue)
                .hidden()

            oneTimeDonation()
                .id(SectionID.oneTime.rawValue)
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
                    
                    donateButton(text: "Donate", link: item.link)
                }
                .id(item.id)
                .hidden(index != 0)
            }
        }
    }

    func oneTimeDonation() -> some HTML {
        VStack(spacing: 20) {
            Link(target: "https://www.donationalerts.com/r/adaengine") {
                HStack {
                    AEImage(path: "donation_alerts_logo.svg", description: "DonationAlerts Logo")
                        .frame(width: 37, height: 43)

                    Text("DonationAlerts")
                        .font(.title6)
                        .foregroundStyle(Color(hex: "#f57507"))
                }
                .frame(width: .percent(100%))
            }
            .padding(.horizontal, 40)
            .padding(.vertical, 10)
            .class("donate-btn", "donate-btn-anim")
            .elevated()

            Link(target: "https://boosty.to/adaengine/donate") {
                Image("/images/icons/ic_boosty.svg", description: "Boosty Logo")
                    .resizable()
                    .frame(height: 43)
                    .frame(width: .percent(100%))
            }
            .padding(.horizontal, 40)
            .padding(.vertical, 10)
            .class("donate-btn", "donate-btn-anim")
            .elevated()
        }
        .padding(.top, 40)
    }

    func donateButton(text: String, link: String) -> some HTML {
        Link(text, target: link)
            .padding(.horizontal, 40)
            .font(.title4)
            .class("donate-btn", "donate-btn-anim")
            .elevated()
    }
}