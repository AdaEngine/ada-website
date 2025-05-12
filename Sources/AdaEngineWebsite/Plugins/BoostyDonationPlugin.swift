
// https://api.boosty.to/v1/blog/adaengine/subscription_level/

import Dependencies
import Foundation
import Ignite

public struct BoostyDonationPlugin: IgnitePlugin {

    @Dependency(\.context)
    private var context

    @MainActor
    func execute() async throws {
        let url = URL(string: "https://api.boosty.to/v1/blog/adaengine/subscription_level/")!
        let request = URLRequest(url: url)
        let (data, _) = try await URLSession.shared.data(for: request)
        let json = try JSONDecoder().decode(BoostyLevelDTO.self, from: data)
        context.boostyLevels = json.data
    }
}

struct BoostyLevelDTO: Equatable, Decodable {
    struct DataDTO: Equatable, Decodable {
        let id: Int
        let name: String
        let isHidden: Bool
        let isArchived: Bool
        let currencyPrices: [String: Double]
    }

    let data: [DataDTO]
}

extension BoostyLevelDTO.DataDTO {
    var rubPrice: Double {
        currencyPrices["RUB"] ?? 0
    }
    
    var usdPrice: Double {
        currencyPrices["USD"] ?? 0
    }
}