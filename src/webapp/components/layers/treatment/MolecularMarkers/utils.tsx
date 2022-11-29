export enum MOLECULAR_MARKER_STATUS {
    HIGH = "HIGH",
    MEDIUM_HIGH = "MEDIUM_HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    UNKNOWN = "UNKNOWN",
}

export const MutationColors: { [key: string]: { color: string } } = {
    A481V: {
        color: "#E98412",
    },
    C469F: {
        color: "#FEB25C",
    },
    F483I: {
        color: "#c1e425",
    },
    F506I: {
        color: "#25e488",
    },
    F506V: {
        color: "#34cbd5",
    },
    G538V: {
        color: "#DE7702",
    },
    N537I: {
        color: "#EE932D",
    },
    P441L: {
        color: "#F38E1B",
    },
    "P441L&N725Y": {
        color: "#D57202",
    },
    P441S: {
        color: "#FC8702",
    },
    P527H: {
        color: "#E87C02",
    },
    R515K: {
        color: "#FC9622",
    },
    V568G: {
        color: "#F18102",
    },
    A481C: {
        color: "#B5039A",
    },
    A481T: {
        color: "#9B30FF",
    },
    A486V: {
        color: "#4F81BD",
    },
    A504D: {
        color: "#A109A1",
    },
    A504G: {
        color: "#EEE5DE",
    },
    A504T: {
        color: "#EA80FC",
    },
    A504V: {
        color: "#3ADB96",
    },
    A548S: {
        color: "#7CFC03",
    },
    A557S: {
        color: "#33A1C9",
    },
    A557T: {
        color: "#FFE7BA",
    },
    A569S: {
        color: "#80D8FF",
    },
    A569T: {
        color: "#FFC0CB",
    },
    A578D: {
        color: "#1CE4AD",
    },
    A578S: {
        color: "#01C85D",
    },
    "A578S&M579I": {
        color: "#039BE5",
    },
    A578T: {
        color: "#D102A2",
    },
    A578V: {
        color: "#BBDEFB",
    },
    A617T: {
        color: "#52EBBF",
    },
    A621F: {
        color: "#32CD32",
    },
    A621G: {
        color: "#38E999",
    },
    A621S: {
        color: "#27FFFE",
    },
    A621V: {
        color: "#D15FEE",
    },
    A626E: {
        color: "#BA68C8",
    },
    A626P: {
        color: "#60D381",
    },
    A626S: {
        color: "#36E7B6",
    },
    A626T: {
        color: "#69F0AE",
    },
    A626V: {
        color: "#C302DE",
    },
    A627S: {
        color: "#EEB4B4",
    },
    A676D: {
        color: "#9108A9",
    },
    A676S: {
        color: "#22FEFB",
    },
    A676V: {
        color: "#CAE1FF",
    },
    A696V: {
        color: "#B502EE",
    },
    C447R: {
        color: "#EEEED1",
    },
    C469P: {
        color: "#36CE73",
    },
    C469W: {
        color: "#1AE4AC",
    },
    C473F: {
        color: "#4527A0",
    },
    C473Y: {
        color: "#7FFF03",
    },
    C532R: {
        color: "#4FF7E0",
    },
    C532S: {
        color: "#9303E7",
    },
    C542G: {
        color: "#64EDC5",
    },
    C542W: {
        color: "#1FD88D",
    },
    C542Y: {
        color: "#30E6B4",
    },
    C580F: {
        color: "#02C85E",
    },
    D452E: {
        color: "#C903A4",
    },
    D452N: {
        color: "#07EEC7",
    },
    D464E: {
        color: "#CDC8B1",
    },
    D464H: {
        color: "#C9069E",
    },
    D464N: {
        color: "#1FF1CF",
    },
    D464Y: {
        color: "#F5DEB3",
    },
    D501G: {
        color: "#05695C",
    },
    D512N: {
        color: "#C107A0",
    },
    D516Y: {
        color: "#A703F1",
    },
    D559N: {
        color: "#9907A7",
    },
    D584E: {
        color: "#38E7B6",
    },
    D584I: {
        color: "#3DF5D9",
    },
    D584N: {
        color: "#9D08EC",
    },
    D584V: {
        color: "#CDC9C9",
    },
    D584Y: {
        color: "#AD0AF4",
    },
    D641G: {
        color: "#CDC9A5",
    },
    D641N: {
        color: "#43D077",
    },
    D648G: {
        color: "#99039D",
    },
    D648H: {
        color: "#FFFF01",
    },
    "D648N&N664D": {
        color: "#BC8F8F",
    },
    D680N: {
        color: "#01FAEB",
    },
    E433D: {
        color: "#8E388E",
    },
    E433G: {
        color: "#AF05EB",
    },
    E455G: {
        color: "#3D5AFE",
    },
    E455K: {
        color: "#D1EEEE",
    },
    "E455K&C469W&G674E": {
        color: "#50EABE",
    },
    E461D: {
        color: "#C5C1AA",
    },
    E509D: {
        color: "#7CB342",
    },
    E509G: {
        color: "#058003",
    },
    E556D: {
        color: "#20F1D0",
    },
    E556K: {
        color: "#CDC673",
    },
    "E556K&D648Y": {
        color: "#AB08F9",
    },
    E556V: {
        color: "#B8860B",
    },
    E567D: {
        color: "#49D179",
    },
    E567K: {
        color: "#CD04A0",
    },
    E596G: {
        color: "#47DD9A",
    },
    E596K: {
        color: "#CCFF90",
    },
    E596R: {
        color: "#0503FF",
    },
    E602D: {
        color: "#55EBC0",
    },
    E605G: {
        color: "#FFB6C1",
    },
    E605K: {
        color: "#31DA93",
    },
    E606D: {
        color: "#B90AF0",
    },
    E606K: {
        color: "#2CD991",
    },
    E612D: {
        color: "#FAEBD7",
    },
    E612G: {
        color: "#45E9BB",
    },
    E612K: {
        color: "#3BCF75",
    },
    E620G: {
        color: "#8C9EFF",
    },
    E620K: {
        color: "#A504F0",
    },
    E643K: {
        color: "#41E9B9",
    },
    E651K: {
        color: "#22E5AF",
    },
    E668K: {
        color: "#FFBBFF",
    },
    E688K: {
        color: "#36F4D7",
    },
    F434I: {
        color: "#2ACD6F",
    },
    F434S: {
        color: "#52D27C",
    },
    "F434Y&T437N": {
        color: "#8A2BE2",
    },
    F439S: {
        color: "#46F6DC",
    },
    F442F: {
        color: "#F0E68C",
    },
    F442L: {
        color: "#FF1493",
    },
    F451I: {
        color: "#7B1FA2",
    },
    F483S: {
        color: "#FF6EB4",
    },
    F483Y: {
        color: "#5E2612",
    },
    F491L: {
        color: "#9F79EE",
    },
    F491S: {
        color: "#9904AD",
    },
    F495L: {
        color: "#51D27C",
    },
    F495S: {
        color: "#2DF3D4",
    },
    F583L: {
        color: "#5E35B1",
    },
    F583S: {
        color: "#0277BD",
    },
    F583Y: {
        color: "#45D078",
    },
    F614L: {
        color: "#29CD6F",
    },
    F628L: {
        color: "#3FCF76",
    },
    F656I: {
        color: "#76EE03",
    },
    "F662C&N664D": {
        color: "#FDF5E6",
    },
    F662Y: {
        color: "#51EBBF",
    },
    F673I: {
        color: "#EECFA1",
    },
    F673L: {
        color: "#A7FFEB",
    },
    F673Y: {
        color: "#26CC6E",
    },
    G449C: {
        color: "#DB7093",
    },
    G449S: {
        color: "#C5E1A5",
    },
    G450V: {
        color: "#64E0A4",
    },
    G453D: {
        color: "#41F5DB",
    },
    G453S: {
        color: "#2CF2D4",
    },
    G484R: {
        color: "#4AD17A",
    },
    G496D: {
        color: "#1BFDF8",
    },
    G496F: {
        color: "#05796B",
    },
    G496S: {
        color: "#55D27D",
    },
    G496V: {
        color: "#B4EEB4",
    },
    G533A: {
        color: "#64FFDA",
    },
    G533C: {
        color: "#19E4AC",
    },
    G533D: {
        color: "#05ACC1",
    },
    G533S: {
        color: "#4D52AC",
    },
    G533V: {
        color: "#E3CF57",
    },
    G544R: {
        color: "#388E3C",
    },
    G545E: {
        color: "#B2DFDB",
    },
    "G545E&WT": {
        color: "#01579B",
    },
    G545R: {
        color: "#FFE4E1",
    },
    G548D: {
        color: "#19F0CD",
    },
    G548S: {
        color: "#F3E5F5",
    },
    G548V: {
        color: "#4CAF50",
    },
    "G553A&A578S": {
        color: "#33DA93",
    },
    G591D: {
        color: "#A70AAE",
    },
    G592E: {
        color: "#059ACD",
    },
    "G592E&V637I": {
        color: "#DDA0DD",
    },
    G592R: {
        color: "#FF34B3",
    },
    G592V: {
        color: "#28E5B1",
    },
    G595S: {
        color: "#2BE6B2",
    },
    G625E: {
        color: "#E040FB",
    },
    G625R: {
        color: "#33E7B5",
    },
    G625V: {
        color: "#912CEE",
    },
    G638R: {
        color: "#458B74",
    },
    G639C: {
        color: "#82B1FF",
    },
    G639D: {
        color: "#EED8AE",
    },
    G639S: {
        color: "#5FE0A2",
    },
    G639V: {
        color: "#FF05FF",
    },
    G665S: {
        color: "#45F6DC",
    },
    G690C: {
        color: "#C5089C",
    },
    G690D: {
        color: "#22F1D0",
    },
    G690V: {
        color: "#CB08E2",
    },
    G709D: {
        color: "#EEEE02",
    },
    G718S: {
        color: "#2979FF",
    },
    "H366L&C447Y&V510G": {
        color: "#01EDC5",
    },
    H644L: {
        color: "#A302AC",
    },
    H719N: {
        color: "#B10598",
    },
    I437T: {
        color: "#B3EE3A",
    },
    I448L: {
        color: "#5DD380",
    },
    I448M: {
        color: "#30E4C8",
    },
    I465F: {
        color: "#AB47BC",
    },
    I465T: {
        color: "#9A32CD",
    },
    "I465T&L619S": {
        color: "#4BEABD",
    },
    I526M: {
        color: "#53D27D",
    },
    "I526M&A578S": {
        color: "#CDCDB4",
    },
    I540S: {
        color: "#03A89E",
    },
    I540T: {
        color: "#07FEAF",
    },
    I543V: {
        color: "#1976D2",
    },
    I552M: {
        color: "#9906E0",
    },
    I587R: {
        color: "#8B2252",
    },
    I587S: {
        color: "#37F090",
    },
    I601T: {
        color: "#28CC6E",
    },
    I613E: {
        color: "#5CACEE",
    },
    I634L: {
        color: "#50F7E0",
    },
    I634T: {
        color: "#054D40",
    },
    I640V: {
        color: "#BA55D3",
    },
    I646K: {
        color: "#689F38",
    },
    I646L: {
        color: "#3BF4D9",
    },
    I646T: {
        color: "#7A378B",
    },
    I683R: {
        color: "#68228B",
    },
    I684N: {
        color: "#44D078",
    },
    I684T: {
        color: "#54F7E2",
    },
    K438N: {
        color: "#EE03EE",
    },
    K479I: {
        color: "#BD08F2",
    },
    K479N: {
        color: "#01E1A4",
    },
    K503E: {
        color: "#6203EA",
    },
    K503N: {
        color: "#4DD0E1",
    },
    K503W: {
        color: "#DEB887",
    },
    K563E: {
        color: "#B506F8",
    },
    K607E: {
        color: "#49EABC",
    },
    K610E: {
        color: "#A301E5",
    },
    K610R: {
        color: "#20FEFA",
    },
    K658E: {
        color: "#C67171",
    },
    K658Q: {
        color: "#CAFF70",
    },
    K658R: {
        color: "#25FFFD",
    },
    L407R: {
        color: "#F5F5DC",
    },
    L422F: {
        color: "#20D88D",
    },
    L457I: {
        color: "#39CF74",
    },
    L457S: {
        color: "#BF0199",
    },
    L463S: {
        color: "#35F4D7",
    },
    L488M: {
        color: "#37DB95",
    },
    L488S: {
        color: "#EEC591",
    },
    L488V: {
        color: "#55F8E3",
    },
    L492S: {
        color: "#39DB95",
    },
    L505F: {
        color: "#22CC6C",
    },
    L505S: {
        color: "#D105E5",
    },
    L598F: {
        color: "#28FFFE",
    },
    L618S: {
        color: "#38F4D8",
    },
    L618V: {
        color: "#EEE9BF",
    },
    "L619E&A621S": {
        color: "#66CD03",
    },
    L619S: {
        color: "#BDB76B",
    },
    L663I: {
        color: "#2BD991",
    },
    L663V: {
        color: "#3DDC97",
    },
    L678V: {
        color: "#EEA2AD",
    },
    L713F: {
        color: "#23D88E",
    },
    M460I: {
        color: "#BCD2EE",
    },
    M460K: {
        color: "#55DF9F",
    },
    M472I: {
        color: "#A305EF",
    },
    M472V: {
        color: "#4FD17B",
    },
    M476K: {
        color: "#FCE6C9",
    },
    M476V: {
        color: "#059688",
    },
    M562I: {
        color: "#458B03",
    },
    M562T: {
        color: "#23FEFC",
    },
    M579I: {
        color: "#5DE0A1",
    },
    M579T: {
        color: "#800303",
    },
    "M579T&L631F": {
        color: "#4EEABE",
    },
    M608K: {
        color: "#EEE9E9",
    },
    M608L: {
        color: "#058B03",
    },
    M608V: {
        color: "#19FDF7",
    },
    N408S: {
        color: "#A2CD5A",
    },
    N458D: {
        color: "#2AD990",
    },
    N458I: {
        color: "#26F2D2",
    },
    "N489D&K503E&A582T": {
        color: "#41D077",
    },
    N490H: {
        color: "#6CA6CD",
    },
    N490S: {
        color: "#B0C4DE",
    },
    N490T: {
        color: "#41DC98",
    },
    N498I: {
        color: "#CD9B9B",
    },
    N499D: {
        color: "#61EDC4",
    },
    N499S: {
        color: "#FFDEAD",
    },
    N523I: {
        color: "#1565C0",
    },
    N523T: {
        color: "#FFEFDB",
    },
    "N523S&T535A&T593A": {
        color: "#85cd3c",
    },
    N525D: {
        color: "#37F4D7",
    },
    N530I: {
        color: "#29B6F6",
    },
    N530K: {
        color: "#37E7B6",
    },
    N530Y: {
        color: "#058B45",
    },
    N531D: {
        color: "#37CE73",
    },
    N531I: {
        color: "#AB82FF",
    },
    N531K: {
        color: "#C0FF3E",
    },
    N531Y: {
        color: "#32DA93",
    },
    N554D: {
        color: "#C1FFC1",
    },
    N554H: {
        color: "#CB059F",
    },
    N554K: {
        color: "#27CC6E",
    },
    N554L: {
        color: "#CDAA7D",
    },
    N554S: {
        color: "#388E8E",
    },
    "N554S&I590T": {
        color: "#EEDC82",
    },
    N585K: {
        color: "#4CEABD",
    },
    N587K: {
        color: "#03A9F4",
    },
    N594K: {
        color: "#2AE6B2",
    },
    N599Y: {
        color: "#8B1C62",
    },
    N609L: {
        color: "#33CE72",
    },
    N609S: {
        color: "#1CCB6A",
    },
    N629S: {
        color: "#BB06AE",
    },
    N629Y: {
        color: "#8B1A1A",
    },
    N632D: {
        color: "#872657",
    },
    N664D: {
        color: "#1E88E5",
    },
    N664S: {
        color: "#62EDC4",
    },
    N672I: {
        color: "#80CBC4",
    },
    N672S: {
        color: "#35DB94",
    },
    N689K: {
        color: "#4FC3F7",
    },
    N694K: {
        color: "#1AFDF7",
    },
    N704T: {
        color: "#8A3324",
    },
    P419S: {
        color: "#05868B",
    },
    P443Q: {
        color: "#4ED17B",
    },
    P443R: {
        color: "#63E0A3",
    },
    P443S: {
        color: "#2DDA91",
    },
    P475L: {
        color: "#B701EF",
    },
    P475S: {
        color: "#EEE8AA",
    },
    P553I: {
        color: "#1BE4AD",
    },
    P553S: {
        color: "#2FE6B3",
    },
    P553T: {
        color: "#910799",
    },
    P570L: {
        color: "#9B06A8",
    },
    P615L: {
        color: "#BFEFFF",
    },
    P615N: {
        color: "#785ACD",
    },
    P615Q: {
        color: "#4FEABE",
    },
    P615S: {
        color: "#01D483",
    },
    P615T: {
        color: "#9F03E3",
    },
    P667Q: {
        color: "#4DEABD",
    },
    P667R: {
        color: "#A0522D",
    },
    P667T: {
        color: "#B452CD",
    },
    P701L: {
        color: "#23E5AF",
    },
    P701R: {
        color: "#4EF7DF",
    },
    Q467H: {
        color: "#B509AB",
    },
    Q468K: {
        color: "#6959CD",
    },
    Q468R: {
        color: "#A908E8",
    },
    Q613E: {
        color: "#1FFEFA",
    },
    Q613H: {
        color: "#FFAEB9",
    },
    Q633R: {
        color: "#24FFFC",
    },
    Q654R: {
        color: "#35CE73",
    },
    Q661I: {
        color: "#6495ED",
    },
    Q661P: {
        color: "#21CC6C",
    },
    Q661R: {
        color: "#54EBC0",
    },
    R411K: {
        color: "#60ECC4",
    },
    R471P: {
        color: "#304FFE",
    },
    R471S: {
        color: "#8510D8",
    },
    R513H: {
        color: "#0D47A1",
    },
    R513L: {
        color: "#C7C7C7",
    },
    R513P: {
        color: "#A905A5",
    },
    R513S: {
        color: "#34DA94",
    },
    R515I: {
        color: "#BF3EFF",
    },
    R515T: {
        color: "#FFF68F",
    },
    R528G: {
        color: "#05BCD4",
    },
    R528T: {
        color: "#1AF0CE",
    },
    R529K: {
        color: "#836FFF",
    },
    R539F: {
        color: "#A308A2",
    },
    R539I: {
        color: "#BF04DC",
    },
    R539K: {
        color: "#1FCB6B",
    },
    R561K: {
        color: "#EEE8CD",
    },
    R575G: {
        color: "#9B03AE",
    },
    R575I: {
        color: "#53F7E2",
    },
    R575K: {
        color: "#21E5AF",
    },
    R575T: {
        color: "#EE30A7",
    },
    R597I: {
        color: "#61F9E9",
    },
    R622G: {
        color: "#05897B",
    },
    S459L: {
        color: "#1AD78B",
    },
    S459T: {
        color: "#9101A3",
    },
    S466I: {
        color: "#A501AD",
    },
    S466N: {
        color: "#5CD380",
    },
    "S477F&T677I": {
        color: "#2FE5FD",
    },
    "S477F&WT": {
        color: "#26429A",
    },
    S477Y: {
        color: "#64F9EA",
    },
    "S477Y&A504T": {
        color: "#62D482",
    },
    S485K: {
        color: "#81D4FA",
    },
    S485N: {
        color: "#E066FF",
    },
    S522C: {
        color: "#2EDA92",
    },
    S522R: {
        color: "#4DDE9C",
    },
    S536L: {
        color: "#60F9E8",
    },
    S549A: {
        color: "#2EE6B3",
    },
    S549F: {
        color: "#1D21B6",
    },
    S549P: {
        color: "#F4A460",
    },
    S549T: {
        color: "#808069",
    },
    S549Y: {
        color: "#C703F7",
    },
    S550Y: {
        color: "#3ECF76",
    },
    S576L: {
        color: "#7D26CD",
    },
    S577A: {
        color: "#43F5DB",
    },
    S577L: {
        color: "#e4d425",
    },
    S577P: {
        color: "#7A8B8B",
    },
    S600F: {
        color: "#5D478B",
    },
    S623C: {
        color: "#EE82EE",
    },
    S679L: {
        color: "#800380",
    },
    S695T: {
        color: "#EEEEE0",
    },
    S700L: {
        color: "#07C863",
    },
    S711T: {
        color: "#9CCC65",
    },
    T474I: {
        color: "#EED5D2",
    },
    "T474I&V520I": {
        color: "#FFEBCD",
    },
    T478P: {
        color: "#9D05A9",
    },
    "T508A&N537S": {
        color: "#BD099E",
    },
    T508N: {
        color: "#551A8B",
    },
    T535A: {
        color: "#FFF003",
    },
    T535M: {
        color: "#A106EE",
    },
    T573A: {
        color: "#24D88E",
    },
    T593N: {
        color: "#A909F8",
    },
    T677A: {
        color: "#B3E5FC",
    },
    T677I: {
        color: "#2196F3",
    },
    T677K: {
        color: "#B303ED",
    },
    T677R: {
        color: "#3ACF74",
    },
    T677S: {
        color: "#BD0298",
    },
    V445G: {
        color: "#8E8E38",
    },
    V454A: {
        color: "#4BD17A",
    },
    V454I: {
        color: "#53DE9E",
    },
    V487I: {
        color: "#26C6DA",
    },
    V494A: {
        color: "#FFE4C4",
    },
    V494I: {
        color: "#B2EBF2",
    },
    V494L: {
        color: "#2FDA92",
    },
    V510M: {
        color: "#8B0A50",
    },
    V517I: {
        color: "#3DE8B8",
    },
    V520A: {
        color: "#0591EA",
    },
    V520I: {
        color: "#39E8B7",
    },
    "V520I&V637I": {
        color: "#8B0303",
    },
    V534A: {
        color: "#4DD17B",
    },
    V534I: {
        color: "#FF82AB",
    },
    V534L: {
        color: "#5EF9E7",
    },
    V555A: {
        color: "#B9D3EE",
    },
    V555L: {
        color: "#19D78B",
    },
    V566I: {
        color: "#3EDC97",
    },
    V566K: {
        color: "#512DA8",
    },
    "V568M&V603I": {
        color: "#36648B",
    },
    V581A: {
        color: "#29FFFF",
    },
    V581F: {
        color: "#4FDE9D",
    },
    V581I: {
        color: "#43DC99",
    },
    V589A: {
        color: "#5CDFA1",
    },
    V589G: {
        color: "#30CD71",
    },
    V589I: {
        color: "#EE3A8C",
    },
    V603E: {
        color: "#CF06E4",
    },
    V603I: {
        color: "#9C661F",
    },
    "V603I&WT": {
        color: "#283593",
    },
    V637A: {
        color: "#4876FF",
    },
    V637D: {
        color: "#EEDFCC",
    },
    V637G: {
        color: "#058B8B",
    },
    V637I: {
        color: "#3CCF75",
    },
    V650F: {
        color: "#6A0DAD",
    },
    V666A: {
        color: "#DA70D6",
    },
    V666I: {
        color: "#CD6090",
    },
    V692F: {
        color: "#9ACD32",
    },
    V692L: {
        color: "#AD0796",
    },
    W470E: {
        color: "#3FDC97",
    },
    W470R: {
        color: "#C909E1",
    },
    W518C: {
        color: "#DEE0E2",
    },
    "W565C&A578S": {
        color: "#FF69B4",
    },
    W565L: {
        color: "#50D17C",
    },
    W565R: {
        color: "#40DC98",
    },
    W611S: {
        color: "#40F5DA",
    },
    W660C: {
        color: "#C6E2FF",
    },
    WT: {
        color: "#012164",
    },
    Y482H: {
        color: "#7B68EE",
    },
    Y482S: {
        color: "#B2DFEE",
    },
    Y493C: {
        color: "#0597A7",
    },
    Y500C: {
        color: "#20B2AA",
    },
    Y511H: {
        color: "#EED5B7",
    },
    Y519C: {
        color: "#54DE9E",
    },
    Y519H: {
        color: "#02D483",
    },
    Y519K: {
        color: "#5EE0A2",
    },
    Y519Y: {
        color: "#CF03A1",
    },
    Y541F: {
        color: "#2DD98F",
    },
    Y541H: {
        color: "#B307F7",
    },
    Y546H: {
        color: "#0288D1",
    },
    Y558C: {
        color: "#B90496",
    },
    Y558H: {
        color: "#44E9BA",
    },
    Y588C: {
        color: "#52F7E1",
    },
    Y588F: {
        color: "#2DE6B3",
    },
    Y604H: {
        color: "#50DE9D",
    },
    Y616N: {
        color: "#7A67EE",
    },
    Y616S: {
        color: "#A102E4",
    },
    Y630F: {
        color: "#AA03FF",
    },
    Y635C: {
        color: "#31E7B4",
    },
    Y653N: {
        color: "#0b81bd",
    },
    A675V: {
        color: "#960018",
    },
    C469Y: {
        color: "#ce2029",
    },
    R622I: {
        color: "#ff0000",
    },
    G449A: {
        color: "#da2c43",
    },
    C580Y: {
        color: "#EC1B02",
    },
    "C580Y&H697N": {
        color: "#FE5642",
    },
    "C580Y&P553L": {
        color: "#CB1701",
    },
    F446I: {
        color: "#A71201",
    },
    "F446I&P574L": {
        color: "#E13B27",
    },
    I543T: {
        color: "#DB1A0F",
    },
    M476I: {
        color: "#C02B3D",
    },
    "M476I&V589I": {
        color: "#F03B51",
    },
    N458Y: {
        color: "#B91428",
    },
    P553L: {
        color: "#CE041C",
    },
    "P553L&C580Y": {
        color: "#E72F46",
    },
    P574: {
        color: "#EC4B37",
    },
    P574L: {
        color: "#FE4630",
    },
    R539T: {
        color: "#FE6553",
    },
    "R539T&C580Y": {
        color: "#FE0111",
    },
    "R539T&D559N": {
        color: "#B91501",
    },
    R561H: {
        color: "#FF3821",
    },
    "R561H&C580Y": {
        color: "#DE1902",
    },
    T474A: {
        color: "#7525e4",
    },
    Y493H: {
        color: "#BF2513",
    },
    "Y493H&C580Y": {
        color: "#D62E1A",
    },
    "Y519H&C580Y": {
        color: "#FE1D02",
    },
};
