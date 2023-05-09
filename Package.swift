// swift-tools-version:5.7

import PackageDescription

let package = Package(
    name: "AdaEngineWebsite",
    platforms: [.macOS(.v12)],
    products: [
        .executable(name: "AdaEngineWebsite", targets: ["AdaEngineWebsite"])
    ],
    dependencies: [
        .package(url: "https://github.com/johnsundell/publish.git", from: "0.9.0"),
        .package(url: "https://github.com/alexito4/ReadingTimePublishPlugin.git", from: "0.3.0"),
        .package(url: "https://github.com/labradon/MinifyCSSPublishPlugin.git", branch: "master"),
        .package(url: "https://github.com/SpectralDragon/TagColorCSSGeneratorPlugin.git", from: "0.2.0"),
        .package(url: "https://github.com/SpectralDragon/CodeSyntaxCSSGeneratorPlugin.git", from: "0.2.0"),
        .package(url: "https://github.com/insidegui/TwitterPublishPlugin.git", from: "0.2.0"),
        .package(url: "https://github.com/insidegui/DarkImagePublishPlugin", from: "1.0.0")
    ],
    targets: [
        .executableTarget(
            name: "AdaEngineWebsite",
            dependencies: [
                .product(name: "Publish", package: "publish"),
                "MinifyCSSPublishPlugin",
                "ReadingTimePublishPlugin",
                "TagColorCSSGeneratorPlugin",
                "CodeSyntaxCSSGeneratorPlugin",
                "TwitterPublishPlugin",
                "DarkImagePublishPlugin"
            ]
        )
    ]
)
