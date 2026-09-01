import AppKit
import CoreGraphics

let srcPath = "/Users/Achal/.gemini/antigravity/brain/78fbb997-6a55-436f-bc83-5841bfa31938/.user_uploaded/media_1788246330088.png"
guard let srcImage = NSImage(contentsOfFile: srcPath),
      let cgSrc = srcImage.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    print("Failed to load source image")
    exit(1)
}

let srcW = CGFloat(cgSrc.width)
let srcH = CGFloat(cgSrc.height)

// Crop the 4th colorful/clean Jain symbol on the right (approx x: 740 to 990, y: 15 to 430)
let cropRect = CGRect(x: 740 * (srcW / 1024.0), y: 15 * (srcH / 465.0), width: 250 * (srcW / 1024.0), height: 420 * (srcH / 465.0))
guard let croppedSymbol = cgSrc.cropping(to: cropRect) else {
    print("Failed to crop symbol")
    exit(1)
}

// Create 1024x1024 canvas
let iconSize = CGSize(width: 1024, height: 1024)
let colorSpace = CGColorSpaceCreateDeviceRGB()
guard let context = CGContext(data: nil, width: 1024, height: 1024, bitsPerComponent: 8, bytesPerRow: 0, space: colorSpace, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else {
    print("Failed to create context")
    exit(1)
}

// Draw rich golden saffron background gradient
let colors = [
    NSColor(red: 1.0, green: 0.43, blue: 0.0, alpha: 1.0).cgColor, // #FF6F00 Deep Saffron
    NSColor(red: 1.0, green: 0.6, blue: 0.0, alpha: 1.0).cgColor,  // #FF9800 Gold Saffron
    NSColor(red: 0.95, green: 0.25, blue: 0.0, alpha: 1.0).cgColor // Deep Warm Crimson accent
] as CFArray

if let gradient = CGGradient(colorsSpace: colorSpace, colors: colors, locations: [0.0, 0.7, 1.0]) {
    context.drawRadialGradient(gradient, startCenter: CGPoint(x: 512, y: 512), startRadius: 50, endCenter: CGPoint(x: 512, y: 512), endRadius: 700, options: [.drawsAfterEndLocation, .drawsBeforeStartLocation])
}

// Draw inner glowing circle badge
let circleRect = CGRect(x: 64, y: 64, width: 896, height: 896)
context.setFillColor(NSColor(red: 1.0, green: 0.97, blue: 0.9, alpha: 0.95).cgColor)
context.fillEllipse(in: circleRect)

context.setLineWidth(16)
context.setStrokeColor(NSColor(red: 1.0, green: 0.84, blue: 0.0, alpha: 1.0).cgColor) // #FFD700
context.strokeEllipse(in: circleRect)

// Draw the sacred Jain symbol centered inside circle badge
let destW: CGFloat = 580
let destH: CGFloat = 760
let destX = (1024 - destW) / 2
let destY = (1024 - destH) / 2
let drawRect = CGRect(x: destX, y: destY, width: destW, height: destH)

context.draw(croppedSymbol, in: drawRect)

// Export to PNG
guard let finalCG = context.makeImage() else {
    print("Failed to make final image")
    exit(1)
}

let newRep = NSBitmapImageRep(cgImage: finalCG)
guard let pngData = newRep.representation(using: .png, properties: [:]) else {
    print("Failed to get PNG data")
    exit(1)
}

let iconUrl = URL(fileURLWithPath: "/Users/Achal/.gemini/antigravity/scratch/HinduPanchangReactNative/assets/icon.png")
let adaptiveUrl = URL(fileURLWithPath: "/Users/Achal/.gemini/antigravity/scratch/HinduPanchangReactNative/assets/adaptive-icon.png")
let splashUrl = URL(fileURLWithPath: "/Users/Achal/.gemini/antigravity/scratch/HinduPanchangReactNative/assets/splash.png")

try? pngData.write(to: iconUrl)
try? pngData.write(to: adaptiveUrl)
try? pngData.write(to: splashUrl)

print("Jain App Icon generated successfully at assets/icon.png & adaptive-icon.png")
