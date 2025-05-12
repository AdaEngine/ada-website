// swift-tools-version:6.0

import PackageDescription

let package = Package(
    name: "AdaEngineWebsite",
    platforms: [.macOS(.v13)],
    products: [
        .executable(name: "AdaEngineWebsite", targets: ["AdaEngineWebsite"])
    ],
    dependencies: [
        .package(url: "https://github.com/twostraws/Ignite.git", branch: "main"),
        .package(url: "https://github.com/pointfreeco/swift-dependencies.git", from: "1.9.2")
    ],
    targets: [
        .executableTarget(
            name: "AdaEngineWebsite",
            dependencies: [
                "Ignite",
                .product(name: "Dependencies", package: "swift-dependencies"),
                .product(name: "DependenciesMacros", package: "swift-dependencies")
            ]
        )
    ]
)
