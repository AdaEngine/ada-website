// swift-tools-version:6.0

import PackageDescription

let package = Package(
    name: "AdaEngineWebsite",
    platforms: [.macOS(.v13)],
    products: [
        .executable(name: "AdaEngineWebsite", targets: ["AdaEngineWebsite"])
    ],
    dependencies: [
        .package(url: "https://github.com/twostraws/Ignite.git", revision: "024f32c00352e3bd3f9ad9ab86db12bbccd0ec00"),
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
