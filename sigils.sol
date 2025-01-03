// SPDX-License-Identifier: No License
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



/// @notice This interface is needed to interact with the PLEDGE contract.
/// @dev the getPledgerData function returns the following values in this order: 
///       pledger status (0 == unpledged, 1 == active pledge, 2 == failed pledge, 3 == completed pledge), 
///       $PLEDGE balance, 
///       pledged $PLEDGE balance, 
///       $PLEDGE transferred this window, 
///       transferable $PLEDGE this window, 
///       time remaining in the current window.
interface PLEDGE {
    function getPledgerData(address _address) 
        external 
        view 
        returns (uint8, uint256, uint256, uint256, uint256, uint256);
}

/// @title SIGILS
/// @notice ERC-721 NFT contract for the SIGILS collection
/// @author Matto (AKA MonkMatto), 2024. More info: matto.xyz
contract SIGILS is ERC721Royalty, Ownable(msg.sender) {
    constructor() ERC721("SIGILS", "SIGILS") {}
    uint256 private _nextTokenId;
    using Strings for string;

    address public constant PLEDGE_CONTRACT = 0x910812c44eD2a3B611E4b051d9D83A88d652E2DD;
    uint256 public constant BASE_PLEDGE_COST = 2500; // does not include decimals
    mapping(uint256 => uint256) public tokenMagic;
    uint96 public royaltyBPS;
    address public royaltyReceiver;
    string public description;
    string public website;
    string private tokenImagePt1 = '<?xml version="1.0" encoding="utf-8"?><svg id="Sigils" viewBox="0 0 1000 1000" style="background-color:rgb(0,0,0)" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="Times New Roman, serif" font-size="120" font-style="italic" fill="white">Guardian Sigil</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="Times New Roman, serif" font-size="90" font-style="italic" fill="white">#';
    string private tokenImagePt2 = '</text><g id="signature" style="stroke:white; stroke-width:3px; stroke-linecap:round;"><polyline points="924,956 920,956 920,860 940,872 960,860 960,956 956,956" /><polyline points="928,902 940,872 952,902" stroke-linejoin="bevel" /><line x1="934" y1="888" x2="946" y2="888" /><line x1="920" y1="902" x2="960" y2="902" /><line x1="932" y1="902" x2="932" y2="927" /><line x1="948" y1="902" x2="948" y2="927" /><circle cx="940" cy="940" r="15" /></g></svg>';
    string private htmlPart1 = 
        '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Sigils</title><style type="text/css" id="Sigils Generator">body {margin: 0;padding: 0;}canvas {padding: 0;margin: auto;display: block;position: absolute;top: 0;bottom: 0;left: 0;right: 0;}</style></head><body><script>';
    string private script = 
        'const project="Sigils 1.1";console.log(`${project} copyright Matto 2024`),console.log("URL PARAMETERS IN HTML MODE: address=0x..., plot=bool, stroke-width=positive-number, signature=bool, invert=bool, random=bool, distance=number"),console.log(`DEFAULT ADDRESS: ${address}`);let plot=!1,invert=!1,strokeWidth=1,distance=10,showSignature=!0,backgroundColor="rgb(25,25,25)",strokeColor="white";const urlParams=new URLSearchParams(window.location.search),urlAddress=urlParams.get("address");if(urlAddress){let t=/^0x[0-9a-fA-F]{40}$/;t.test(urlAddress)&&(address=urlAddress,console.log(`CUSTOM ADDRESS: ${address}`))}const urlPlot=urlParams.get("plot");"true"==urlPlot&&(plot=!0),console.log(`PLOT MODE: ${plot}`);const urlStroke=urlParams.get("stroke-wdith");urlStroke&&(strokeWidth=urlStroke);const urlStrokeWidth=urlParams.get("stroke-width");urlStrokeWidth&&!isNaN(urlStrokeWidth)&&(strokeWidth=urlStrokeWidth),console.log(`STROKE WIDTH: ${strokeWidth}`);const urlSignature=urlParams.get("signature");"false"==urlSignature&&(showSignature=!1),console.log(`SIGNATURE: ${showSignature}`);const urlInvert=urlParams.get("invert");"true"==urlInvert?(invert=!0,backgroundColor="rgb(230,230,230)",strokeColor="black",console.log("INVERT MODE: true")):(backgroundColor="rgb(25,25,25)",strokeColor="white",console.log("INVERT MODE: false"));const urlRandom=urlParams.get("random");"true"==urlRandom&&(address=makeHash(40),console.log(`RANDOM ADDRESS: ${address}`));const urlDistance=urlParams.get("distance");urlDistance&&!isNaN(urlDistance)&&(distance=10*parseInt(urlDistance)),console.log(`DISTANCE: ${distance/10}`);let width=1e3,height=1e3,mid=width/2,hashArray=address.slice(2).split(""),shapes=hashArray.length,points=Array(shapes);for(let i=0;i<shapes;i++)points[i]=[];let spacing=Math.floor((width-10*distance)/shapes),bg=`<g id="background"><desc>Background Color</desc>`,mg1=`<g id="midground-1"><desc>Midground Circles at nodes, stroke-width = 1x.</desc>`,mg2=`<g id="midground-2"><desc>Midground lines at center, stroke-width = 2x.</desc>`,fg=`<g id="foreground"><desc>Foreground shapes, stroke-width = 3x.</desc>`,svg,pens=[`stroke:${strokeColor}; stroke-width:${1*strokeWidth}px; stroke-opacity:0.1;`,`stroke:${strokeColor}; stroke-width:${2*strokeWidth}px; stroke-opacity:0.2;`,`stroke:${strokeColor}; stroke-width:${3*strokeWidth}px; stroke-opacity:1.0;`,],hue=parseInt(hashArray[0],16)/16*360;console.log(`STARTING HUE: ${hue}`);let saturation=100,lightness=50,color;setColor(hue,saturation,lightness);let svgStart=`<?xml version="1.0" encoding="utf-8"?><svg id="${project}" viewBox="0 0 ${width} ${width}" style="background-color:${backgroundColor}; stroke:${strokeColor}; stroke-linecap:round; fill-opacity:0;" xmlns="http://www.w3.org/2000/svg">`,sig=signature();function setColor(t,e,r){color=`hsl(${t},${e}%,${r}%)`}function signature(){let t=`<g id="signature" style="stroke:${strokeColor}; stroke-width:${3*strokeWidth}px; stroke-opacity:1; stroke-linecap:round; fill-opacity:0;" ><desc>Signature, stroke-width = 3x.</desc>`;return t+=`<polyline points="924,956 920,956 920,860 940,872 960,860 960,956 956,956" />`,t+=`<polyline points="928,902 940,872 952,902" stroke-linejoin="bevel" />`,t+=L(934,888,946,888),t+=L(920,902,960,902),t+=L(932,902,932,927),t+=L(948,902,948,927),t+=C(940,940,15),t+="</g>"}for(let i=0;i<shapes;i++){let e=spacing*(shapes-i)/2,r=1+parseInt(hashArray[i],16)%16;if(mg2+=C(mid,mid,e,`${pens[1]}`),1==r)console.log(`Nothing drawn for shape ${i}, shifting color.`),setColor(hue+=22.5,saturation,lightness);else if(2==r)console.log(`Drawing a single circle for shape ${i}.`),points[i].push({mid,mid}),fg+=MC(mid,mid,e,4,`${pens[2]}`);else{console.log(`Drawing ${r} sections for shape ${i}.`),inscribe(i,r,e);let s=`<polygon points="`;for(let o=0;o<r;o++)s+=`${points[i][o].x},${points[i][o].y} `,mg2+=L(points[i][o].x,points[i][o].y,mid,mid,`${pens[1]}`),0==o?fg+=L(points[i][o].x,points[i][o].y,points[i][r-1].x,points[i][r-1].y,`${pens[2]}`):fg+=L(points[i][o].x,points[i][o].y,points[i][o-1].x,points[i][o-1].y,`${pens[2]}`),mg1+=CC(points[i][o].x,points[i][o].y,4*strokeWidth,3,`${pens[0]}`);bg+=`${s}" style="stroke-opacity:0; fill-opacity:.075; fill:${color};" />`;let l=Math.sqrt(Math.pow(points[i][0].x-points[i][1].x,2)+Math.pow(points[i][0].y-points[i][1].y,2));for(let n=0;n<r;n++)bg+=C(points[i][n].x,points[i][n].y,l,`stroke-opacity:0; fill-opacity:.02; fill:${color};`)}}function updateSVG(){let t=document.getElementById(project);t&&t.remove(),svg=plot?`${svgStart}${mg1}${mg2}${fg}`:`${svgStart}${bg}${mg1}${mg2}${fg}`,showSignature?svg+=`${sig}</svg>`:svg+="</svg>",document.body.insertAdjacentHTML("beforeend",svg)}function inscribe(t,e,r){for(let s=0;s<e;s++){let o=s/e*Math.PI*2;o-=Math.PI/2;let l=mid+r*Math.cos(o),n=mid+r*Math.sin(o);points[t].push({x:l,y:n})}}function C(t,e,r,s=""){r<0&&(r=0);let o=`<circle cx="${t}" cy="${e}" r="${r}" `;return""==s?o+="/>":o+=`style="${s}" />`,o}function FC(t,e,r,s=""){let o=`<g style="${s}"><desc>Filled Circle</desc>`,l=.9*strokeWidth;for(let n=r;n>0;n-=l)o+=C(t,e,n);return o+"</g>"}function MC(t,e,r,s,o=""){let l=`<g style="${o}"><desc>Multiple Circles</desc>`,n=.9*strokeWidth;for(let d=0;d<s;d++)l+=C(t,e,r),r-=n;return l+"</g>"}function CC(t,e,r,s,o=""){let l=`<g style="${o}"><desc>Concentric Circles</desc>`;for(let n=1;n<s;n++)l+=C(t,e,r*n);return l+"</g>"}function L(t,e,r,s,o=""){let l=`<line x1="${t}" y1="${e}" x2="${r}" y2="${s}" `;return""==o?l+="/>":l+=`style="${o}" />`,l}function makeHash(t=64){let e="0123456789abcdef",r="";for(let s=0;s<t;s++)r+=e.charAt(Math.floor(Math.random()*e.length));return"0x"+r}function rplc(t,e,r){return t.split(e).join(r)}function saveStrings(t,e,r){let s=new Blob(t,{type:"image/svg+xml"}),o=document.createElement("a");o.href=URL.createObjectURL(s),o.download=`${e}.${r}`,o.click()}bg+="</g>",mg1+="</g>",mg2+="</g>",fg+="</g>",updateSVG(),document.addEventListener("keydown",t=>{let e=t.key.toUpperCase();if("S"===e)saveStrings([svg],plot?`Sigils-plot_${address}`:`Sigils_${address}`,"svg");else if("H"===e)showSignature=!showSignature,updateSVG();else if("P"===e)plot=!plot,updateSVG();else if("I"===e){let r="black",s="white",o="rgb(25,25,25)",l="rgb(230,230,230)",n=fg,d=mg1,a=mg2,g=svgStart,c=sig;invert?(invert=!1,n=rplc(n,r,s),d=rplc(d,r,s),a=rplc(a,r,s),c=rplc(c,r,s),g=rplc(g,l,o)):(invert=!0,n=rplc(n,s,r),d=rplc(d,s,r),a=rplc(a,s,r),c=rplc(c,s,r),g=rplc(g,o,l)),svgStart=g,mg1=d,mg2=a,fg=n,sig=c,updateSVG()}});';
    string private htmlPart2 = '</script></body></html>';

    function _getGuardianStatus(address _address) internal view returns (bool) {
        (uint8 pledgerStatus, uint256 PLEDGEBalance, uint256 pledgedPLEDGEBalance, , uint256 transferablePLEDGEThisWindow, ) = PLEDGE(PLEDGE_CONTRACT).getPledgerData(_address);
        return pledgerStatus == 1 && pledgedPLEDGEBalance >= 1_000_000 * 10 * 18 && transferablePLEDGEThisWindow > 2 * BASE_PLEDGE_COST;
    }

    /// @notice Mints tokens to an address
    /// @param _to The address to mint the token to
    function MINT(address _to) external {
        require(_getGuardianStatus(_to), "SIGILS: Guardian status not met");
        // check that proper payment has been made
        _makeMagic(_nextTokenId);
        _safeMint(_to, _nextTokenId);
        _nextTokenId++;
    }

    function BURN_AND_RECLAIM(uint256 _tokenId) external onlyOwner {
        _burn(_tokenId);
        // transfer base pledge to token burner
    }


    /// @notice Assembles the HTML for a token
    /// @param _tokenId The token ID to assemble the HTML for
    function getHTML(
        uint256 _tokenId
    ) public view returns (string memory) {
        string memory html = string(
            abi.encodePacked(
                htmlPart1,
                'tokenData = {address: "',
                Strings.toHexString(uint160(ownerOf(_tokenId)), 20),
                '" guardian: ',
                _getGuardianStatus(ownerOf(_tokenId)),
                '};',
                script,
                htmlPart2
            )
        );
        return html;
    }

    /// @notice Token URI function for ERC721
    /// @param _tokenId The token ID to get the URI for
    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        require(
            _tokenId < _nextTokenId,
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory tokenImageSVG = string(
            abi.encodePacked(
                tokenImagePt1,
                _tokenId.toString(),
                tokenImagePt2
            )
        );
        string memory base64Image = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(bytes(tokenImageSVG))
            )
        );
        string memory base64HTML = string(
            abi.encodePacked(
                "data:text/html;base64,",
                Base64.encode(bytes(getHTML(_tokenId)))
            )
        );
        string memory attributes = attributesArray(_tokenId);
        string memory uri = string(
            abi.encodePacked(
                '{"artist": "Matto", "name": "Sigils #',
                _tokenId,
                '", "description": "',
                description,
                '", "external_url": "',
                website,
                '", "image": "',
                base64Image,
                '", "animation_url": "',
                base64HTML,
                '", "attributes": ',
                attributes,
                "}"
            )
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes(uri))
                )
            );
    }

    /// @notice Returns the attributes for a token
    /// @param _tokenId The token ID to get the attributes for
    function attributesArray(uint256 _tokenId) public view returns (string memory) {
        string memory attributes = string(
            abi.encodePacked(
                '[{"trait_type": "$PLEDGE VALUE", "value": "',
                BASE_PLEDGE_COST.toString(),
                '"}, {"trait_type": "Magic", "value": "',
                tokenMagic[_tokenId].toString(),
                '"}, {"trait_type": "", "value": "',
                ,
                '"}, {"trait_type": "", "value": "',
                ,
                '"}, {"trait_type": "", "value": "',
                ,
                '"}, {"trait_type": "", "value": "',
                ,
                '"}, {"trait_type": "", "value": "',
                ,
                '"}, {"trait_type": "", "value": "',
                ,
                '"}, {"trait_type": "", "value": "',
                ,
                '"}, {"trait_type": "", "value": "',
                ,
                '"}, {"trait_type": "", "value": "',
                ,
                '"}, {"trait_type": "", "value": "',

                '"}]'
            )
        );
        return attributes;
    }


    /// @notice Returns the total supply of tokens
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    /// @notice Allows owner to set the main description
    /// @param _description The new description to be set
    function setDescription(string calldata _description) external onlyOwner {
        description = _description;
    }

    /// @notice Allows owner to set the website
    /// @param _website The new website to be set
    function setWebsite(string calldata _website) external onlyOwner {
        website = _website;
    }

    /// @notice Allows owner to set the token image part 1
    /// @param _tokenImagePt1 The new token image part 1 to be set
    function setTokenImagePt1(string calldata _tokenImagePt1) external onlyOwner {
        tokenImagePt1 = _tokenImagePt1;
    }

    /// @notice Allows owner to set the token image part 2
    /// @param _tokenImagePt2 The new token image part 2 to be set
    function setTokenImagePt2(string calldata _tokenImagePt2) external onlyOwner {
        tokenImagePt2 = _tokenImagePt2;
    }

    /// @notice Allows owner to set the HTML start
    /// @param _htmlPart1 The new HTML start to be set
    function setHtmlPart1(string calldata _htmlPart1) external onlyOwner {
        htmlPart1 = _htmlPart1;
    }

    /// @notice Allows owner to set the HTML end
    /// @param _htmlPart2 The new HTML end to be set
    function setHtmlPart2(string calldata _htmlPart2) external onlyOwner {
        htmlPart2 = _htmlPart2;
    }

    /// @notice Allows owner to set the script
    /// @param _script The new script to be set
    function setScript(string calldata _script) external onlyOwner {
        script = _script;
    }

    /// @notice Allows owner to set the royalty
    /// @param _royaltyBPS The new royalty to be set
    function setRoyalty(uint96 _royaltyBPS, address _royaltyReceiver) external onlyOwner {
        royaltyBPS = _royaltyBPS;
        royaltyReceiver = _royaltyReceiver;
        _setDefaultRoyalty(royaltyReceiver, royaltyBPS);
    }
}

/// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64
/// @author Brecht Devos <brecht@loopring.org>
library Base64 {
    bytes internal constant TABLE =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /// @notice Encodes some bytes to the base64 representation
    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";
        uint256 encodedLen = 4 * ((len + 2) / 3);
        bytes memory result = new bytes(encodedLen + 32);
        bytes memory table = TABLE;

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)
                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF)
                )
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF)
                )
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(input, 0x3F))), 0xFF)
                )
                out := shl(224, out)
                mstore(resultPtr, out)
                resultPtr := add(resultPtr, 4)
            }
            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }
            mstore(result, encodedLen)
        }
        return string(result);
    }
}
