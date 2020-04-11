// swift-tools-version:5.1

import PackageDescription

let package = Package(
    name: "Blog",
    products: [
        .executable(name: "Blog", targets: ["Blog"])
    ],
    dependencies: [
        .package(url: "https://github.com/johnsundell/publish.git", from: "0.3.0"),
        .package(url: "https://github.com/SwiftyGuerrero/CNAMEPublishPlugin.git", from: "0.2.0"),
        .package(url: "https://github.com/alexito4/ReadingTimePublishPlugin.git", from: "0.1.0"),
        .package(url: "https://github.com/labradon/MinifyCSSPublishPlugin.git", from: "0.1.0"),
        .package(url: "https://github.com/JohnSundell/SplashPublishPlugin.git", from: "0.1.0")
    ],
    targets: [
        .target(
            name: "Blog",
            dependencies: [
                "Publish",
                "MinifyCSSPublishPlugin",
                "ReadingTimePublishPlugin",
                "CNAMEPublishPlugin",
                "SplashPublishPlugin"
            ]
        )
    ]
)
