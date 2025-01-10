// SPDX-License-Identifier: No License
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @notice This interface is needed to interact with the PLEDGE contract.
/// @dev the getPledgerData function returns the following values in this order: 
///       pledger status (0 == unpledged, 1 == active pledge, 2 == failed pledge, 3 == completed pledge), 
///       $PLEDGE balance, 
///       pledged $PLEDGE balance, 
///       $PLEDGE transferred this window, 
///       transferable $PLEDGE this window, 
///       time remaining in the current window.
interface iPLEDGE {
    function getPledgerData(address _address) 
        external 
        view 
        returns (uint8, uint256, uint256, uint256, uint256, uint256);
}

/// @notice This interface is needed to interact with ERC20 tokens.
/// @dev The transfer and transferFrom functions are needed to handle the $PLEDGE token.
/// @dev These could have been included in the iPLEDGE interface, but they're separate for clarity.
interface iERC20 {
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool); 
}

/// @title GUARDIAN SIGILS
/// @notice ERC-721 NFT contract for the GUARDIAN SIGILS collection
/// @author Matto-Shinkai (AKA MonkMatto), 2025. More info: matto.xyz
contract GUARDIAN_SIGILS is ERC721Royalty, ReentrancyGuard, Ownable(msg.sender) {
    constructor() ERC721("Guardian Sigils", "SIGILS") {}
    using Strings for string;
    bool public riftOpen;
    uint16 private maxSigils = 777;
    uint96 public royaltyBPS;
    uint256 private _nextTokenId;
    uint256 private _tokenSupply;
    uint256 public constant HALF_SUMMONING_COST = 2_500 * 10**18;
    mapping(uint256 => uint256) public tokenMagic;
    address private constant PLEDGE_CONTRACT = 0x37538D1201486e11f5A06779168a30bA9D683a12; // Testnet
    // address private constant PLEDGE_CONTRACT = 0x910812c44eD2a3B611E4b051d9D83A88d652E2DD; // Mainnet
    address public royaltyReceiver;
    address public artistAddress = 0xfc1e361711328f105F314f48C49D8c0eb0C6610E;
    string public description;
    string public website = 'https://matto.xyz';
    string private tokenImagePt1 = '<?xml version="1.0" encoding="utf-8"?><svg id="Guardian Sigils" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradient-bg" cx="50%" cy="50%" r="60%" fx="50%" fy="50%"><stop offset="0%" stop-color="hsl(';
    string private tokenImagePt2 = ', 100%, 30%)" /><stop offset="100%" stop-color="hsl(';
    string private tokenImagePt3 = ', 100%, 10%)" /></radialGradient></defs><rect x="0" y="0" width="1000" height="1000" fill="url(#gradient-bg)" /><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="Times New Roman, serif" font-size="120" font-style="italic" fill="white">Guardian Sigil</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="Times New Roman, serif" font-size="90" font-style="italic" fill="white">#';
    string private tokenImagePt4 = '</text><g id="signature" style="stroke:white; stroke-width:3px; stroke-linecap:round; fill-opacity:0%"><polyline points="924,956 920,956 920,860 940,872 960,860 960,956 956,956" /><polyline points="928,902 940,872 952,902" stroke-linejoin="bevel" /><line x1="934" y1="888" x2="946" y2="888" /><line x1="920" y1="902" x2="960" y2="902" /><line x1="932" y1="902" x2="932" y2="927" /><line x1="948" y1="902" x2="948" y2="927" /><circle cx="940" cy="940" r="15" /></g></svg>';
    string private htmlPart1 = 
        '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Guardian Sigil</title><style type="text/css" id="Guardian Sigil Generator">body {margin: 0;padding: 0;}canvas {padding: 0;margin: auto;display: block;position: absolute;top: 0;bottom: 0;left: 0;right: 0;}</style></head><body><script>';
    string private script = 
        'const project="Guardian Sigils",version="5.0";console.log(`${project} 5.0 copyright Matto 2025`),console.log("URL PARAMETERS IN HTML MODE: address=0x...; bools: mono, simplified, signature, invert, ghost, ether-style, still; numbers: stroke-width, distance");let address=tokenData.address,traits=tokenData.traits,guardian=ToF(traits[0]),mono=ToF(traits[1]),invert=ToF(traits[2]),simplified=ToF(traits[3]),ghost=ToF(traits[4]),etherStyle=ToF(traits[5]),distance=traits[6];distance>10&&(distance=-distance/10);let strokeWidth,customStroke=!1,still=!1,showSignature=!1,backgroundColor="rgb(25,25,25)",strokeColor="white";const urlParams=new URLSearchParams(window.location.search),urlAddress=urlParams.get("address");if(urlAddress){let s=/^0x[0-9a-fA-F]{40}$/;s.test(urlAddress)&&(address=urlAddress)}const urlStill=urlParams.get("still");"true"==urlStill&&(still=!0);const urlGhost=urlParams.get("ghost");"true"==urlGhost&&(ghost=!0);const urlMono=urlParams.get("mono");"true"==urlMono&&(mono=!0);const urlEtherStyle=urlParams.get("ether-style");"true"==urlEtherStyle&&(etherStyle=!0);const urlStrokeWidth=urlParams.get("stroke-width");urlStrokeWidth&&!isNaN(urlStrokeWidth)&&(strokeWidth=urlStrokeWidth,customStroke=!0);const urlSignature=urlParams.get("signature");"true"==urlSignature&&(showSignature=!0);const urlsimplified=urlParams.get("simplified");"true"==urlsimplified&&(simplified=!0);const urlInvert=urlParams.get("invert");"true"==urlInvert?invert=!0:"false"==urlInvert&&(invert=!1);const urlDistance=urlParams.get("distance");urlDistance&&!isNaN(urlDistance)&&urlDistance<11&&(distance=parseInt(urlDistance));let width=1e3,height=1e3,mid=width/2;customStroke||(strokeWidth=Math.round(10*(1.1-distance/10))/10),invert&&(backgroundColor="rgb(230,230,230)",strokeColor="black");let hashArray=address.slice(2).split(""),shapes=hashArray.length,points=Array(shapes);for(let i=0;i<shapes;i++)points[i]=[];let spacing=Math.floor((width-(distance+1)*90)/shapes),bg=`<g id="background"><desc>Background Color</desc>`,mg1=`<g id="midground-1"><desc>Midground circles at nodes, stroke-width = 1x.</desc>`,mg2=`<g id="midground-2"><desc>Midground concentric circles and lines at center, stroke-width = 2x.</desc>`,fg=`<g id="foreground"><desc>Foreground shapes, stroke-width = 3x.</desc>`,svgAnima,svgStill,shapeGroups=Array(shapes),ss="stroke:",sws="stroke-width:",sos="stroke-opacity:",fos="fill-opacity:",pens=[`${ss}${strokeColor}; ${sws}${1*strokeWidth}px; ${sos}0.1;`,`${ss}${strokeColor}; ${sws}${2*strokeWidth}px; ${sos}0.075;`,`${ss}${strokeColor}; ${sws}${3*strokeWidth}px; ${sos}1.0;`,];ghost&&(pens=[`${ss}${strokeColor}; ${sws}${1*strokeWidth}px; ${sos}.5;`,`${ss}${strokeColor}; ${sws}${2*strokeWidth}px; ${sos}0.075;`,`${ss}${strokeColor}; ${sws}${3*strokeWidth}px; ${sos}0.1;`,]);let hue=parseInt(hashArray[0],16)/16*360;console.log(`STARTING HUE: ${hue}`);let saturation=60,lightness=50,color;setColor(hue,saturation,lightness);let svgStart=`<?xml version="1.0" encoding="utf-8"?><svg id="${project}" viewBox="0 0 ${width} ${width}" style="background-color:${backgroundColor}; ${ss}${strokeColor}; stroke-linecap:round; ${fos}0;" xmlns="http://www.w3.org/2000/svg">`,sig=signature();function setColor(s,t,e){color=`hsl(${s},${t}%,${e}%)`}function signature(){let s=`<g id="signature" style="${ss}${strokeColor}; ${sws}${3*strokeWidth}px; ${sos}1; stroke-linecap:round; ${fos}0;" ><desc>Signature, stroke-width = 3x.</desc>`;return s+=`<polyline points="924,956 920,956 920,860 940,872 960,860 960,956 956,956" />`,s+=`<polyline points="928,902 940,872 952,902" stroke-linejoin="bevel" />`,s+=L(934,888,946,888),s+=L(920,902,960,902),s+=L(932,902,932,927),s+=L(948,902,948,927),s+=C(940,940,15),s+="</g>"}for(let i=0;i<shapes;i++){shapeGroups[i]=`<g id="shape${i}">`;let t=spacing*(shapes-i)/2,e=1+parseInt(hashArray[i],16)%16;if(mg2+=C(mid,mid,t,`${pens[1]}`),shapeGroups[i]+=C(mid,mid,t,`${pens[1]}`),1==e)console.log(`Nothing drawn for shape ${i}, shifting color.`),setColor(hue+=22.5,saturation,lightness);else if(2==e)console.log(`Drawing a single circle for shape ${i}.`),points[i].push({mid,mid}),guardian&&(fg+=MC(mid,mid,t,4,`${pens[2]}`),shapeGroups[i]+=MC(mid,mid,t,4,`${pens[2]}`));else{if(inscribe(i,e,t),guardian){let o,r=`<polygon points="`;for(let n=0;n<e;n++){if(r+=`${points[i][n].x},${points[i][n].y} `,!simplified){if(etherStyle){let l=(40-i)*strokeWidth/2.5,a=Math.atan2(points[i][n].y-mid,points[i][n].x-mid),d=points[i][n].x+l*Math.cos(a+Math.PI/2),g=points[i][n].y+l*Math.sin(a+Math.PI/2),p=points[i][n].x+l*Math.cos(a-Math.PI/2),u=points[i][n].y+l*Math.sin(a-Math.PI/2),c=Math.atan2(points[i][n].y-mid,points[i][n].x-mid),h=points[i][n].x+2*l*Math.cos(c+Math.PI),$=points[i][n].y+2*l*Math.sin(c+Math.PI),m=points[i][n].x+2*l*Math.cos(c),f=points[i][n].y+2*l*Math.sin(c);o=L(h,$,m,f,`${pens[0]}`),o+=`<polygon points="${d},${g} ${h},${$} ${p},${u} ${m},${f}" style="${pens[0]}" />`}else o=CC(points[i][n].x,points[i][n].y,4*strokeWidth,3,`${pens[0]}`);mg1+=o,shapeGroups[i]+=o,mg2+=o=L(points[i][n].x,points[i][n].y,mid,mid,`${pens[1]}`),shapeGroups[i]+=o}0==n?(fg+=o=L(points[i][n].x,points[i][n].y,points[i][e-1].x,points[i][e-1].y,`${pens[2]}`),shapeGroups[i]+=o):(fg+=o=L(points[i][n].x,points[i][n].y,points[i][n-1].x,points[i][n-1].y,`${pens[2]}`),shapeGroups[i]+=o)}bg+=o=`${r}" style="${sos}0; ${fos}.075; fill:${color};" />`,mono||(shapeGroups[i]+=o)}let k=Math.sqrt(Math.pow(points[i][0].x-points[i][1].x,2)+Math.pow(points[i][0].y-points[i][1].y,2));for(let y=0;y<e;y++)bg+=C(points[i][y].x,points[i][y].y,k,`${sos}0; ${fos}.02; fill:${color};`),mono||(shapeGroups[i]+=C(points[i][y].x,points[i][y].y,k,`${sos}0; ${fos}.02; fill:${color};`))}let _=.2*t,v=0,S=360;(e+i)%2==0&&(v=360,S=0),shapeGroups[i]+=`<animateTransform attributeName="transform" type="rotate" from="${v} ${mid} ${mid}" to="${S} ${mid} ${mid}" dur="${_}s" repeatCount="indefinite" />`,shapeGroups[i]+="</g>"}function updateSVG(){let s=document.getElementById(project);s&&s.remove(),svgAnima=svgStart,svgStill=svgStart,mono?svgStill+=`${mg1}${mg2}${fg}`:svgStill+=`${bg}${mg1}${mg2}${fg}`;for(let t=0;t<shapes;t++)svgAnima+=shapeGroups[t];showSignature?(svgStill+=`${sig}</svg>`,svgAnima+=`${sig}</svg>`):(svgStill+="</svg>",svgAnima+="</svg>"),still?document.body.insertAdjacentHTML("beforeend",svgStill):document.body.insertAdjacentHTML("beforeend",svgAnima)}function inscribe(s,t,e){for(let o=0;o<t;o++){let r=o/t*Math.PI*2;r-=Math.PI/2;let n=mid+e*Math.cos(r),l=mid+e*Math.sin(r);points[s].push({x:n,y:l})}}function C(s,t,e,o=""){e<0&&(e=0);let r=`<circle cx="${s}" cy="${t}" r="${e}" `;return""==o?r+="/>":r+=`style="${o}" />`,r}function FC(s,t,e,o=""){let r=`<g style="${o}"><desc>Filled Circle</desc>`,n=.9*strokeWidth;for(let l=e;l>0;l-=n)r+=C(s,t,l);return r+"</g>"}function MC(s,t,e,o,r=""){let n=`<g style="${r}"><desc>Multiple Circles</desc>`,l=.9*strokeWidth;for(let a=0;a<o;a++)n+=C(s,t,e),e-=l;return n+"</g>"}function CC(s,t,e,o,r=""){let n=`<g style="${r}"><desc>Concentric Circles</desc>`;for(let l=1;l<o;l++)n+=C(s,t,e*l);return n+"</g>"}function L(s,t,e,o,r=""){let n=`<line x1="${s}" y1="${t}" x2="${e}" y2="${o}" `;return""==r?n+="/>":n+=`style="${r}" />`,n}function ToF(s){return 1==s}function saveStrings(s,t,e){if("png"===e){let o=document.createElement("canvas"),r=o.getContext("2d");o.width=6*width,o.height=6*height,r.fillStyle=backgroundColor,r.fillRect(0,0,6*width,6*height);let n=new Image;n.onload=()=>{r.drawImage(n,0,0),o.toBlob(s=>{let o=document.createElement("a");o.href=URL.createObjectURL(s),o.download=`${t}.${e}`,o.click()})},n.src=`data:image/svg+xml;base64,${btoa(s)}`;return}let l=new Blob(s,{type:"image/svg+xml"}),a=document.createElement("a");a.href=URL.createObjectURL(l),a.download=`${t}.${e}`,a.click()}bg+="</g>",mg1+="</g>",mg2+="</g>",fg+="</g>",updateSVG(),document.addEventListener("keydown",s=>{let t=s.key.toUpperCase();if("A"===t||"S"===t||"P"===t){let e=`${project}_${address}${mono?"_mono":""}`;"A"===t?saveStrings([svgAnima],`${e}_ANIMA`,"svg"):"S"===t?saveStrings([svgStill],`${e}_STILL`,"svg"):"P"===t&&saveStrings([svgStill],`${e}_BITMA`,"png")}else"H"===t&&(showSignature=!showSignature,updateSVG())});';
    string private htmlPart2 = '</script></body></html>';

    event Reclaimed(address indexed sender, uint256 tokenId, uint256 ERC20Reclaimed);

    /// @notice Ensures that the paying address will not break the pledge with the mint
    modifier ensureNoPledgeBreak(address _address) {
        (uint8 pledgerStatus, , , , uint256 transferablePLEDGEThisWindow, ) = iPLEDGE(PLEDGE_CONTRACT).getPledgerData(_address);
        if (pledgerStatus == 1) {
            require(transferablePLEDGEThisWindow >= 2 * HALF_SUMMONING_COST, "Pledge break detected");
        }
        _;
    }

    /// @notice Summons (mints) a token to an address
    /// @dev Only addresses that meet the guardian status can receive a minted token
    /// @dev tokenSupply is handled separately from nextTokenId because tokens can be burned
    /// @param _to The address to mint the token to
    function SUMMON(address _to) public ensureNoPledgeBreak(msg.sender) nonReentrant {
        require(riftOpen, "Rift Closed");
        require(_getGuardianStatus(_to), "Not Auth");
        iERC20(PLEDGE_CONTRACT).transferFrom(msg.sender, address(this), HALF_SUMMONING_COST);
        iERC20(PLEDGE_CONTRACT).transferFrom(msg.sender, artistAddress, HALF_SUMMONING_COST);
        _makeMagic(_nextTokenId);
        _safeMint(_to, _nextTokenId);
        _tokenSupply++;
        _nextTokenId++;
        if (_nextTokenId == maxSigils) {
            riftOpen = false;
        }
    }

    /// @notice Sacrifices (burns) a token and reclaims the locked $PLEDGE
    /// @dev Only the token owner can sacrifice a token
    /// @param _tokenId The token ID to sacrifice
    function SACRIFICE(uint256 _tokenId) external nonReentrant {
        require(riftOpen == false, "Rift Open");
        require(ownerOf(_tokenId) == msg.sender, "Not Auth");
        _burn(_tokenId);
        _tokenSupply--;
        iERC20(PLEDGE_CONTRACT).transfer(msg.sender, HALF_SUMMONING_COST);
        emit Reclaimed(msg.sender, _tokenId, HALF_SUMMONING_COST);
    }

    /// @notice Returns the total supply of tokens
    function totalSupply() external view returns (uint256) {
        return _tokenSupply;
    }

    /// @notice Assembles the HTML for a token
    /// @param _address The address of the token owner
    /// @param traitsArray The array of uint8 values representing the magic
    function getHTML(
        address _address,
        uint8[] memory traitsArray
    ) public view returns (string memory) {
        string memory html = string(
            abi.encodePacked(
                htmlPart1,
                'tokenData = {address: "',
                Strings.toHexString(uint160(_address), 20),
                '", traits: [',
                Strings.toString(traitsArray[0]),
                ',',
                Strings.toString(traitsArray[1]),
                ',',
                Strings.toString(traitsArray[2]),
                ',',
                Strings.toString(traitsArray[3]),
                ',',
                Strings.toString(traitsArray[4]),
                ',',
                Strings.toString(traitsArray[5]),
                ',',
                Strings.toString(traitsArray[6]),
                ']};',
                script,
                htmlPart2
            )
        );
        return html;
    }

    /// @notice Generates the traits for a token based on its magic value
    /// @dev The traits are generated and assigned to the following indexes:
    ///   index 0 guardian: 0 false 1 true
    ///   index 1 mono: 0 false 1 true
    ///   index 2 invert: 0 false 1 true
    ///   index 3 simplified: 0 false 1 true
    ///   index 4 ghost: 0 false 1 true
    ///   index 5 etherStyle: 0 false 1 true
    ///   index 6 distance: 0, 1, 2, 3, 4, 30, 60, 90
    ///       (JS mappings: 0, 1, 2, 3, 4, -3, -6, -9)
    /// @param _tokenId The token ID to get the magic for
    /// @return An array of uint8 values representing the magic
    function getTokenTraitsArray(uint256 _tokenId) public view returns (uint8[] memory) {
        uint8[] memory traits = new uint8[](7);
        uint256 magic = tokenMagic[_tokenId];
        traits[0] = _getGuardianStatus(ownerOf(_tokenId)) ? 1 : 0;
        traits[1] = magic % 5 == 0 ? 1 : 0;
        magic /= 10;
        traits[2] = magic % 7 == 0 ? 1 : 0;
        magic /= 10;
        traits[3] = magic % 6 == 0 ? 1 : 0;
        magic /= 10;
        traits[4] = magic % 10 == 0 ? 1 : 0;
        magic /= 10;
        traits[5] = magic % 3 == 0 ? 1 : 0;
        magic /= 10;
        uint8 test = uint8(magic % 4);
        magic /= 10;
        if (test == 2) {
            traits[6] = 0;
        } else if (test < 2) {
            traits[6] = uint8(magic % 4) + 1;
        } else {
            traits[6] = (uint8(magic % 3) + 1) * 30;
        }
        return traits;
    }

    /// @notice Token URI function for ERC721
    /// @param _tokenId The token ID to get the URI for
    /// @return The URI for the token
    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        require(
            _tokenId < _nextTokenId,
            "Nonexistent"
        );
        address tokenOwner = ownerOf(_tokenId);
        uint8[] memory traits = getTokenTraitsArray(_tokenId);
        string memory tokenID = Strings.toString(_tokenId);
        string memory hue = _calculateHue(tokenOwner);
        string memory tokenImageSVG = string(
            abi.encodePacked(
                tokenImagePt1,
                hue,
                tokenImagePt2,
                hue,
                tokenImagePt3,
                tokenID,
                tokenImagePt4
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
                Base64.encode(bytes(getHTML(tokenOwner, traits)))
            )
        );
        string memory attributes = _getAttributesString(traits);
        string memory uri = string(
            abi.encodePacked(
                '{"artist": "Matto", "name": "Guardian Sigil #',
                tokenID,
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

    /// @notice Allows owner to open the rift and summon the first token
    /// @param _to The address to summon the first token to
    function openRift(address _to) external onlyOwner {
        riftOpen = true;
        if (_nextTokenId == 0) {
            SUMMON(_to);
        }
    }

    /// @notice Allows owner to toggle Summonings
    function pause() external onlyOwner {
        require (_nextTokenId > 0, "Not Auth");
        riftOpen = !riftOpen;
    }

    /// @notice Allows owner to set the artist address
    /// @param _artistAddress The new artist address to be set
    function setArtistAddress(address _artistAddress) external onlyOwner {
        artistAddress = _artistAddress;
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
    
    /// @notice Allows owner to set the token image part 3
    /// @param _tokenImagePt3 The new token image part 3 to be set
    function setTokenImagePt3(string calldata _tokenImagePt3) external onlyOwner {
        tokenImagePt3 = _tokenImagePt3;
    }

    /// @notice Allows owner to set the token image part 4
    /// @param _tokenImagePt4 The new token image part 4 to be set
    function setTokenImagePt4(string calldata _tokenImagePt4) external onlyOwner {
        tokenImagePt4 = _tokenImagePt4;
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

    /// @notice creates and sets a magic number for a token to determine its traits
    /// @param _tokenId The token ID to create magic for
    function _makeMagic(uint256 _tokenId) internal {
        tokenMagic[_tokenId] = uint256(keccak256(abi.encodePacked(_tokenId, block.timestamp, msg.sender, _tokenId))) % 1000000000;
    }

    /// @notice Checks if an address meets the guardian status
    /// @param _address The address to check
    /// @return A boolean indicating if the address meets the guardian status
    function _getGuardianStatus(address _address) internal view returns (bool) {
        (uint8 pledgerStatus, , uint256 pledgedPLEDGEBalance, , , ) = iPLEDGE(PLEDGE_CONTRACT).getPledgerData(_address);
        return pledgerStatus == 1 && pledgedPLEDGEBalance >= 1_000_000 * 10**18;
    }

    /// @notice Calculates the 'Core Rarity' of a token
    /// @param traits The array of uint8 values representing the traits
    /// @return The 'Core Rarity' value of the token
    function _calculateRarity(uint8[] memory traits) internal pure returns (uint8) {
        uint8 rarityCounter = 0;
        for (uint8 i = 1; i < 6; i++) {
            rarityCounter += traits[i];
        }
        return rarityCounter;
    }

    /// @notice Returns the attributes for a token
    /// @param traits The array of uint8 values representing the magic
    /// @return The attributes as a string representing the array
    function _getAttributesString(uint8[] memory traits) internal pure returns (string memory) {
        string[6] memory rarity = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"];
        uint8 rarityCounter = _calculateRarity(traits);
        string memory negativeSign = traits[6] < 5 ? "" : "-";
        uint8 distance = traits[6] < 5 ? traits[6] : traits[6] / 10;
        string memory attributes = string(
            abi.encodePacked(
                '[{"trait_type": "Owned by Guardian", "value": "',
                _trueFalse(traits[0]),
                '"}, {"trait_type": "Mono", "value": "',
                _trueFalse(traits[1]),
                '"}, {"trait_type": "Invert", "value": "',
                _trueFalse(traits[2]),
                '"}, {"trait_type": "Simplified", "value": "',
                _trueFalse(traits[3]),
                '"}, {"trait_type": "Ghost", "value": "',
                _trueFalse(traits[4]),
                '"}, {"trait_type": "EtherStyle", "value": "',
                _trueFalse(traits[5]),
                '"}, {"trait_type": "Core Rarity", "value": "',
                rarity[rarityCounter],
                '"}, {"trait_type": "Viewing Distance", "value": "',
                negativeSign,
                Strings.toString(distance),
                '"}]'
            )
        );
        return attributes;
    }

    /// @notice Converts a 0 or 1 value to a string representing True or False
    /// @param _value The value to convert
    /// @return The string representation of the value
    function _trueFalse(uint8 _value) internal pure returns (string memory) {
        return _value == 1 ? "True" : "False";
    }

    /// @notice Calculates the hue for a token's image based on the address
    /// @param _address The address to calculate the hue for
    /// @return The hue value as a string
    function _calculateHue(address _address) internal pure returns (string memory) {
        string memory addressString = Strings.toHexString(uint256(uint160(_address)), 20);
        bytes memory addressBytes = bytes(addressString);
        uint8 firstHexDigit = _hexCharToDecimal(addressBytes[2]);
        return Strings.toString((firstHexDigit * 360) / 16);
    }

    /// @notice Converts a hexadecimal character to a decimal value
    /// @param char The hexadecimal character to convert
    /// @return The decimal value of the hexadecimal character
    function _hexCharToDecimal(bytes1 char) internal pure returns (uint8) {
        if (char >= "0" && char <= "9") {
            return uint8(char) - uint8(bytes1("0"));
        } else if (char >= "a" && char <= "f") {
            return uint8(char) - uint8(bytes1("a")) + 10;
        } else if (char >= "A" && char <= "F") {
            return uint8(char) - uint8(bytes1("A")) + 10;
        } else {
            revert("Invalid Character");
        }
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
