//
//  MontlhySponsorCard.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 06.05.2025.
//

import Ignite

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
                        .lineSpacing(1)
                        .font(.primary(size: .px(30)))
                        
                        Spacer()
                        
                        HStack(alignment: .bottom, spacing: .xLarge) {
                            VStack(alignment: .leading, spacing: 6) {
                                ForEach(item.benefits) { benefit in
                                    Text(benefit.rawValue)
                                        .font(.system(size: 12))
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 2)
                                        .border(item.isDark ? .black : .white, width: 1.5, cornerRadii: .init(8))
                                }
                            }
                            
                            Text("AdaEngine")
                                .font(.primary(size: .px(13)))
                        }
                        .padding(.top, 20)
                    }
                    .foregroundStyle(item.fontColor)
                    .frame(width: 270, minHeight: 355)
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
