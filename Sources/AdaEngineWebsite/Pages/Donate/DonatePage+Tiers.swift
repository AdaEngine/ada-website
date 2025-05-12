//
//  DonatePage+Tiers.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 06.05.2025.
//

import Dependencies
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
        (self.name + self.cost + self.link).hashValue.description
    }

    let boostyId: Int 
    let name: String
    let icon: String
    var cost: String
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

extension DonatePage {

    static func monthlyLevels(isUSD: Bool) -> [DonationMonthlyLevel] {
        @Dependency(\.context) var context
        return Self.monthlyBoostyLevels.map { level in
            var level = level

            let boostyLevel = context.boostyLevels.first(where: { $0.id == level.boostyId })
            if isUSD {
                level.cost = "$\(boostyLevel?.usdPrice ?? 0)"
            } else {
                level.cost = "\(boostyLevel?.rubPrice ?? 0)₽"
            }
            return level
        }
    }

    static let monthlyBoostyLevels: [DonationMonthlyLevel] = [
        .init(
            boostyId: 3179294,
            name: "Bronze",
            icon: "/images/ae_logo_white.svg",
            cost: "350₽",
            benefits: [
                .nameInCredits
            ],
            color: "var(--color-donate-level-bronze-color)",
            isDark: false,
            link:
                "https://boosty.to/adaengine/purchase/3179294?ssource=DIRECT&share=subscription_link"
        ),
        .init(
            boostyId: 3179295,
            name: "Silver",
            icon: "/images/ae_logo_white.svg",
            cost: "800₽",
            benefits: [
                .nameInCredits
            ],
            color: "var(--color-donate-level-silver-color)",
            isDark: false,
            link:
                "https://boosty.to/adaengine/purchase/3179295?ssource=DIRECT&share=subscription_link"
        ),
        .init(
            boostyId: 3179293,
            name: "Gold",
            icon: "/images/ae_logo_black.svg",
            cost: "1500₽",
            benefits: [
                .nameInCredits
            ],
            color: "var(--color-donate-level-gold-color)",
            isDark: true,
            link:
                "https://boosty.to/adaengine/purchase/3179293?ssource=DIRECT&share=subscription_link"
        ),
        .init(
            boostyId: 3354083,
            name: "Platinum",
            icon: "/images/ae_logo_black.svg",
            cost: "3500₽",
            benefits: [
                .logoInCredits
            ],
            color: "var(--color-donate-level-platinum-color)",
            isDark: true,
            link:
                "https://boosty.to/adaengine/purchase/3354083?ssource=DIRECT&share=subscription_link"
        ),
        .init(
            boostyId: 3354084,
            name: "Titanium",
            icon: "/images/ae_logo_white.svg",
            cost: "5000₽",
            benefits: [
                .logoInCredits,
                .linkInCredits,
                .supportByTeam,
                .merch,
            ],
            color: "var(--color-donate-level-titanium-color)",
            isDark: false,
            link:
                "https://boosty.to/adaengine/purchase/3354084?ssource=DIRECT&share=subscription_link"
        ),
        .init(
            boostyId: 3354085,
            name: "Diamond",
            icon: "/images/ae_logo_black.svg",
            cost: "20000₽",
            benefits: [
                .logoInCredits,
                .linkInCredits,
                .supportByTeam,
                .merch,
            ],
            color: "var(--color-donate-level-diamond-color)",
            isDark: true,
            link:
                "https://boosty.to/adaengine/purchase/3354085?ssource=DIRECT&share=subscription_link"
        ),
    ]
}
