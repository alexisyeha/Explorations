#include <metal_stdlib>
#include <SwiftUI/SwiftUI_Metal.h>

using namespace metal;

inline bool insideRect(float2 point, float2 rectMin, float2 rectMax) {
    return all(point >= rectMin) && all(point <= rectMax);
}

/// Reflects the free corner across the live fold line. Most of the turned
/// sheet remains flat and opaque; material curvature is concentrated in a
/// narrow shaded crease instead of rolling the page into a uniform tube.
[[ stitchable ]] half4 pageCurl(
    float2 position,
    SwiftUI::Layer layer,
    float4 bounds,
    float overscan,
    float2 pageSize,
    float2 normalizedDragPoint,
    float progress,
    half4 paperColor
) {
    float amount = smoothstep(0.0, 1.0, clamp(progress, 0.0, 1.0));
    float2 pageOrigin = float2(overscan);
    float2 pageMax = pageOrigin + max(pageSize, float2(1.0));

    if (amount <= 0.0001) {
        return layer.sample(position);
    }

    float2 corner = pageMax;
    float2 dragPoint = pageOrigin + normalizedDragPoint * pageSize;
    float2 cornerToDrag = corner - dragPoint;
    float dragDistance = length(cornerToDrag);

    if (dragDistance < 0.5) {
        return layer.sample(position);
    }

    float2 foldNormal = cornerToDrag / dragDistance;
    float2 foldCenter = (corner + dragPoint) * 0.5;
    float signedFoldDistance = dot(position - foldCenter, foldNormal);

    // Reflection is its own inverse: an output point on the turned side maps
    // back to the matching point on the original corner-side of the page.
    float2 reflectedSource = position
        - 2.0 * signedFoldDistance * foldNormal;
    bool sourceIsOnFreeSide = dot(
        reflectedSource - foldCenter,
        foldNormal
    ) >= -0.5;
    bool isFlap = signedFoldDistance <= 0.5
        && sourceIsOnFreeSide
        && insideRect(reflectedSource, pageOrigin, pageMax);

    if (isFlap) {
        float2 insetMin = pageOrigin + float2(0.5);
        float2 insetMax = pageMax - float2(0.5);
        half4 sourceColor = layer.sample(clamp(reflectedSource, insetMin, insetMax));

        if (sourceColor.a <= half(0.001)) {
            return half4(0.0);
        }

        float distanceFromCrease = max(-signedFoldDistance, 0.0);
        float creaseWidth = mix(7.0, 18.0, smoothstep(0.04, 0.62, amount));
        float creaseShade = exp(-distanceFromCrease / max(creaseWidth * 0.68, 1.0));
        float ridge = exp(-pow(
            (distanceFromCrease - creaseWidth * 0.52)
                / max(creaseWidth * 0.30, 1.0),
            2.0
        ));

        half3 backPaper = paperColor.rgb * half3(0.995, 0.988, 0.965);
        half3 flapColor = mix(backPaper, sourceColor.rgb, half(0.065));
        float paperLight = clamp(0.99 - creaseShade * 0.18 + ridge * 0.085, 0.78, 1.04);
        flapColor *= half(paperLight);

        return half4(flapColor, sourceColor.a);
    }

    bool isInsidePage = insideRect(position, pageOrigin, pageMax);

    // The portion on the non-corner side remains attached and perfectly flat.
    if (isInsidePage && signedFoldDistance <= 0.0) {
        return layer.sample(position);
    }

    // A restrained contact shadow sits on the revealed next sheet immediately
    // behind the fold. Everywhere else the removed corner is transparent.
    if (isInsidePage && signedFoldDistance > 0.0) {
        float contactShadow = exp(-signedFoldDistance / 13.0)
            * 0.14
            * smoothstep(0.015, 0.16, amount);
        return half4(0.0, 0.0, 0.0, half(contactShadow));
    }

    return half4(0.0);
}
