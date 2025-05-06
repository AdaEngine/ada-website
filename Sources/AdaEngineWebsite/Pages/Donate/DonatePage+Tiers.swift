//
//  DonatePage+Tiers.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 06.05.2025.
//

import Ignite

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
