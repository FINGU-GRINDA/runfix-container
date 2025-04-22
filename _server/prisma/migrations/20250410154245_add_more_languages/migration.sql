-- AlterTable
ALTER TABLE "Translation" ADD COLUMN     "aaText" TEXT,
ADD COLUMN     "abText" TEXT,
ADD COLUMN     "aeText" TEXT,
ADD COLUMN     "afText" TEXT,
ADD COLUMN     "akText" TEXT,
ADD COLUMN     "amText" TEXT,
ADD COLUMN     "anText" TEXT,
ADD COLUMN     "arText" TEXT,
ADD COLUMN     "asText" TEXT,
ADD COLUMN     "avText" TEXT,
ADD COLUMN     "ayText" TEXT,
ADD COLUMN     "azText" TEXT,
ADD COLUMN     "baText" TEXT,
ADD COLUMN     "beText" TEXT,
ADD COLUMN     "bgText" TEXT,
ADD COLUMN     "bhText" TEXT,
ADD COLUMN     "biText" TEXT,
ADD COLUMN     "bmText" TEXT,
ADD COLUMN     "bnText" TEXT,
ADD COLUMN     "boText" TEXT,
ADD COLUMN     "brText" TEXT,
ADD COLUMN     "bsText" TEXT,
ADD COLUMN     "caText" TEXT,
ADD COLUMN     "ceText" TEXT,
ADD COLUMN     "chText" TEXT,
ADD COLUMN     "coText" TEXT,
ADD COLUMN     "crText" TEXT,
ADD COLUMN     "csText" TEXT,
ADD COLUMN     "cuText" TEXT,
ADD COLUMN     "cvText" TEXT,
ADD COLUMN     "cyText" TEXT,
ADD COLUMN     "daText" TEXT,
ADD COLUMN     "deText" TEXT,
ADD COLUMN     "dvText" TEXT,
ADD COLUMN     "dzText" TEXT,
ADD COLUMN     "eeText" TEXT,
ADD COLUMN     "elText" TEXT,
ADD COLUMN     "eoText" TEXT,
ADD COLUMN     "esText" TEXT,
ADD COLUMN     "etText" TEXT,
ADD COLUMN     "euText" TEXT,
ADD COLUMN     "faText" TEXT,
ADD COLUMN     "ffText" TEXT,
ADD COLUMN     "fiText" TEXT,
ADD COLUMN     "fjText" TEXT,
ADD COLUMN     "foText" TEXT,
ADD COLUMN     "frText" TEXT,
ADD COLUMN     "fyText" TEXT,
ADD COLUMN     "gaText" TEXT,
ADD COLUMN     "gdText" TEXT,
ADD COLUMN     "glText" TEXT,
ADD COLUMN     "gnText" TEXT,
ADD COLUMN     "guText" TEXT,
ADD COLUMN     "gvText" TEXT,
ADD COLUMN     "haText" TEXT,
ADD COLUMN     "heText" TEXT,
ADD COLUMN     "hiText" TEXT,
ADD COLUMN     "hoText" TEXT,
ADD COLUMN     "hrText" TEXT,
ADD COLUMN     "htText" TEXT,
ADD COLUMN     "huText" TEXT,
ADD COLUMN     "hyText" TEXT,
ADD COLUMN     "hzText" TEXT,
ADD COLUMN     "iaText" TEXT,
ADD COLUMN     "ieText" TEXT,
ADD COLUMN     "igText" TEXT,
ADD COLUMN     "iiText" TEXT,
ADD COLUMN     "ikText" TEXT,
ADD COLUMN     "ioText" TEXT,
ADD COLUMN     "isText" TEXT,
ADD COLUMN     "itText" TEXT,
ADD COLUMN     "iuText" TEXT,
ADD COLUMN     "jvText" TEXT,
ADD COLUMN     "kaText" TEXT,
ADD COLUMN     "kgText" TEXT,
ADD COLUMN     "kiText" TEXT,
ADD COLUMN     "kjText" TEXT,
ADD COLUMN     "klText" TEXT,
ADD COLUMN     "kmText" TEXT,
ADD COLUMN     "knText" TEXT,
ADD COLUMN     "krText" TEXT,
ADD COLUMN     "ksText" TEXT,
ADD COLUMN     "kuText" TEXT,
ADD COLUMN     "kvText" TEXT,
ADD COLUMN     "kwText" TEXT,
ADD COLUMN     "kyText" TEXT,
ADD COLUMN     "laText" TEXT,
ADD COLUMN     "lbText" TEXT,
ADD COLUMN     "lgText" TEXT,
ADD COLUMN     "liText" TEXT,
ADD COLUMN     "lnText" TEXT,
ADD COLUMN     "loText" TEXT,
ADD COLUMN     "ltText" TEXT,
ADD COLUMN     "luText" TEXT,
ADD COLUMN     "lvText" TEXT,
ADD COLUMN     "mgText" TEXT,
ADD COLUMN     "mhText" TEXT,
ADD COLUMN     "miText" TEXT,
ADD COLUMN     "mkText" TEXT,
ADD COLUMN     "mlText" TEXT,
ADD COLUMN     "mrText" TEXT,
ADD COLUMN     "msText" TEXT,
ADD COLUMN     "mtText" TEXT,
ADD COLUMN     "myText" TEXT,
ADD COLUMN     "naText" TEXT,
ADD COLUMN     "nbText" TEXT,
ADD COLUMN     "ndText" TEXT,
ADD COLUMN     "neText" TEXT,
ADD COLUMN     "ngText" TEXT,
ADD COLUMN     "nlText" TEXT,
ADD COLUMN     "nnText" TEXT,
ADD COLUMN     "noText" TEXT,
ADD COLUMN     "nrText" TEXT,
ADD COLUMN     "nvText" TEXT,
ADD COLUMN     "nyText" TEXT,
ADD COLUMN     "ocText" TEXT,
ADD COLUMN     "ojText" TEXT,
ADD COLUMN     "omText" TEXT,
ADD COLUMN     "orText" TEXT,
ADD COLUMN     "osText" TEXT,
ADD COLUMN     "paText" TEXT,
ADD COLUMN     "piText" TEXT,
ADD COLUMN     "plText" TEXT,
ADD COLUMN     "psText" TEXT,
ADD COLUMN     "ptText" TEXT,
ADD COLUMN     "quText" TEXT,
ADD COLUMN     "rmText" TEXT,
ADD COLUMN     "rnText" TEXT,
ADD COLUMN     "roText" TEXT,
ADD COLUMN     "rwText" TEXT,
ADD COLUMN     "saText" TEXT,
ADD COLUMN     "scText" TEXT,
ADD COLUMN     "sdText" TEXT,
ADD COLUMN     "seText" TEXT,
ADD COLUMN     "sgText" TEXT,
ADD COLUMN     "siText" TEXT,
ADD COLUMN     "skText" TEXT,
ADD COLUMN     "slText" TEXT,
ADD COLUMN     "smText" TEXT,
ADD COLUMN     "snText" TEXT,
ADD COLUMN     "soText" TEXT,
ADD COLUMN     "sqText" TEXT,
ADD COLUMN     "srText" TEXT,
ADD COLUMN     "ssText" TEXT,
ADD COLUMN     "stText" TEXT,
ADD COLUMN     "suText" TEXT,
ADD COLUMN     "svText" TEXT,
ADD COLUMN     "swText" TEXT,
ADD COLUMN     "taText" TEXT,
ADD COLUMN     "teText" TEXT,
ADD COLUMN     "tgText" TEXT,
ADD COLUMN     "tiText" TEXT,
ADD COLUMN     "tkText" TEXT,
ADD COLUMN     "tlText" TEXT,
ADD COLUMN     "tnText" TEXT,
ADD COLUMN     "toText" TEXT,
ADD COLUMN     "trText" TEXT,
ADD COLUMN     "tsText" TEXT,
ADD COLUMN     "ttText" TEXT,
ADD COLUMN     "twText" TEXT,
ADD COLUMN     "tyText" TEXT,
ADD COLUMN     "ugText" TEXT,
ADD COLUMN     "ukText" TEXT,
ADD COLUMN     "urText" TEXT,
ADD COLUMN     "veText" TEXT,
ADD COLUMN     "voText" TEXT,
ADD COLUMN     "waText" TEXT,
ADD COLUMN     "woText" TEXT,
ADD COLUMN     "xhText" TEXT,
ADD COLUMN     "yiText" TEXT,
ADD COLUMN     "yoText" TEXT,
ADD COLUMN     "zaText" TEXT,
ADD COLUMN     "zuText" TEXT;

-- CreateIndex
CREATE INDEX "Translation_aaText_idx" ON "Translation"("aaText");

-- CreateIndex
CREATE INDEX "Translation_abText_idx" ON "Translation"("abText");

-- CreateIndex
CREATE INDEX "Translation_aeText_idx" ON "Translation"("aeText");

-- CreateIndex
CREATE INDEX "Translation_afText_idx" ON "Translation"("afText");

-- CreateIndex
CREATE INDEX "Translation_akText_idx" ON "Translation"("akText");

-- CreateIndex
CREATE INDEX "Translation_amText_idx" ON "Translation"("amText");

-- CreateIndex
CREATE INDEX "Translation_anText_idx" ON "Translation"("anText");

-- CreateIndex
CREATE INDEX "Translation_arText_idx" ON "Translation"("arText");

-- CreateIndex
CREATE INDEX "Translation_asText_idx" ON "Translation"("asText");

-- CreateIndex
CREATE INDEX "Translation_avText_idx" ON "Translation"("avText");

-- CreateIndex
CREATE INDEX "Translation_ayText_idx" ON "Translation"("ayText");

-- CreateIndex
CREATE INDEX "Translation_azText_idx" ON "Translation"("azText");

-- CreateIndex
CREATE INDEX "Translation_baText_idx" ON "Translation"("baText");

-- CreateIndex
CREATE INDEX "Translation_beText_idx" ON "Translation"("beText");

-- CreateIndex
CREATE INDEX "Translation_bgText_idx" ON "Translation"("bgText");

-- CreateIndex
CREATE INDEX "Translation_bhText_idx" ON "Translation"("bhText");

-- CreateIndex
CREATE INDEX "Translation_biText_idx" ON "Translation"("biText");

-- CreateIndex
CREATE INDEX "Translation_bmText_idx" ON "Translation"("bmText");

-- CreateIndex
CREATE INDEX "Translation_bnText_idx" ON "Translation"("bnText");

-- CreateIndex
CREATE INDEX "Translation_boText_idx" ON "Translation"("boText");

-- CreateIndex
CREATE INDEX "Translation_brText_idx" ON "Translation"("brText");

-- CreateIndex
CREATE INDEX "Translation_bsText_idx" ON "Translation"("bsText");

-- CreateIndex
CREATE INDEX "Translation_caText_idx" ON "Translation"("caText");

-- CreateIndex
CREATE INDEX "Translation_ceText_idx" ON "Translation"("ceText");

-- CreateIndex
CREATE INDEX "Translation_chText_idx" ON "Translation"("chText");

-- CreateIndex
CREATE INDEX "Translation_coText_idx" ON "Translation"("coText");

-- CreateIndex
CREATE INDEX "Translation_crText_idx" ON "Translation"("crText");

-- CreateIndex
CREATE INDEX "Translation_csText_idx" ON "Translation"("csText");

-- CreateIndex
CREATE INDEX "Translation_cuText_idx" ON "Translation"("cuText");

-- CreateIndex
CREATE INDEX "Translation_cvText_idx" ON "Translation"("cvText");

-- CreateIndex
CREATE INDEX "Translation_cyText_idx" ON "Translation"("cyText");

-- CreateIndex
CREATE INDEX "Translation_daText_idx" ON "Translation"("daText");

-- CreateIndex
CREATE INDEX "Translation_deText_idx" ON "Translation"("deText");

-- CreateIndex
CREATE INDEX "Translation_dvText_idx" ON "Translation"("dvText");

-- CreateIndex
CREATE INDEX "Translation_dzText_idx" ON "Translation"("dzText");

-- CreateIndex
CREATE INDEX "Translation_eeText_idx" ON "Translation"("eeText");

-- CreateIndex
CREATE INDEX "Translation_elText_idx" ON "Translation"("elText");

-- CreateIndex
CREATE INDEX "Translation_eoText_idx" ON "Translation"("eoText");

-- CreateIndex
CREATE INDEX "Translation_esText_idx" ON "Translation"("esText");

-- CreateIndex
CREATE INDEX "Translation_etText_idx" ON "Translation"("etText");

-- CreateIndex
CREATE INDEX "Translation_euText_idx" ON "Translation"("euText");

-- CreateIndex
CREATE INDEX "Translation_faText_idx" ON "Translation"("faText");

-- CreateIndex
CREATE INDEX "Translation_ffText_idx" ON "Translation"("ffText");

-- CreateIndex
CREATE INDEX "Translation_fiText_idx" ON "Translation"("fiText");

-- CreateIndex
CREATE INDEX "Translation_fjText_idx" ON "Translation"("fjText");

-- CreateIndex
CREATE INDEX "Translation_foText_idx" ON "Translation"("foText");

-- CreateIndex
CREATE INDEX "Translation_frText_idx" ON "Translation"("frText");

-- CreateIndex
CREATE INDEX "Translation_fyText_idx" ON "Translation"("fyText");

-- CreateIndex
CREATE INDEX "Translation_gaText_idx" ON "Translation"("gaText");

-- CreateIndex
CREATE INDEX "Translation_gdText_idx" ON "Translation"("gdText");

-- CreateIndex
CREATE INDEX "Translation_glText_idx" ON "Translation"("glText");

-- CreateIndex
CREATE INDEX "Translation_gnText_idx" ON "Translation"("gnText");

-- CreateIndex
CREATE INDEX "Translation_guText_idx" ON "Translation"("guText");

-- CreateIndex
CREATE INDEX "Translation_gvText_idx" ON "Translation"("gvText");

-- CreateIndex
CREATE INDEX "Translation_haText_idx" ON "Translation"("haText");

-- CreateIndex
CREATE INDEX "Translation_heText_idx" ON "Translation"("heText");

-- CreateIndex
CREATE INDEX "Translation_hiText_idx" ON "Translation"("hiText");

-- CreateIndex
CREATE INDEX "Translation_hoText_idx" ON "Translation"("hoText");

-- CreateIndex
CREATE INDEX "Translation_hrText_idx" ON "Translation"("hrText");

-- CreateIndex
CREATE INDEX "Translation_htText_idx" ON "Translation"("htText");

-- CreateIndex
CREATE INDEX "Translation_huText_idx" ON "Translation"("huText");

-- CreateIndex
CREATE INDEX "Translation_hyText_idx" ON "Translation"("hyText");

-- CreateIndex
CREATE INDEX "Translation_hzText_idx" ON "Translation"("hzText");

-- CreateIndex
CREATE INDEX "Translation_iaText_idx" ON "Translation"("iaText");

-- CreateIndex
CREATE INDEX "Translation_ieText_idx" ON "Translation"("ieText");

-- CreateIndex
CREATE INDEX "Translation_igText_idx" ON "Translation"("igText");

-- CreateIndex
CREATE INDEX "Translation_iiText_idx" ON "Translation"("iiText");

-- CreateIndex
CREATE INDEX "Translation_ikText_idx" ON "Translation"("ikText");

-- CreateIndex
CREATE INDEX "Translation_ioText_idx" ON "Translation"("ioText");

-- CreateIndex
CREATE INDEX "Translation_isText_idx" ON "Translation"("isText");

-- CreateIndex
CREATE INDEX "Translation_itText_idx" ON "Translation"("itText");

-- CreateIndex
CREATE INDEX "Translation_iuText_idx" ON "Translation"("iuText");

-- CreateIndex
CREATE INDEX "Translation_jvText_idx" ON "Translation"("jvText");

-- CreateIndex
CREATE INDEX "Translation_kaText_idx" ON "Translation"("kaText");

-- CreateIndex
CREATE INDEX "Translation_kgText_idx" ON "Translation"("kgText");

-- CreateIndex
CREATE INDEX "Translation_kiText_idx" ON "Translation"("kiText");

-- CreateIndex
CREATE INDEX "Translation_kjText_idx" ON "Translation"("kjText");

-- CreateIndex
CREATE INDEX "Translation_klText_idx" ON "Translation"("klText");

-- CreateIndex
CREATE INDEX "Translation_kmText_idx" ON "Translation"("kmText");

-- CreateIndex
CREATE INDEX "Translation_knText_idx" ON "Translation"("knText");

-- CreateIndex
CREATE INDEX "Translation_krText_idx" ON "Translation"("krText");

-- CreateIndex
CREATE INDEX "Translation_ksText_idx" ON "Translation"("ksText");

-- CreateIndex
CREATE INDEX "Translation_kuText_idx" ON "Translation"("kuText");

-- CreateIndex
CREATE INDEX "Translation_kvText_idx" ON "Translation"("kvText");

-- CreateIndex
CREATE INDEX "Translation_kwText_idx" ON "Translation"("kwText");

-- CreateIndex
CREATE INDEX "Translation_kyText_idx" ON "Translation"("kyText");

-- CreateIndex
CREATE INDEX "Translation_laText_idx" ON "Translation"("laText");

-- CreateIndex
CREATE INDEX "Translation_lbText_idx" ON "Translation"("lbText");

-- CreateIndex
CREATE INDEX "Translation_lgText_idx" ON "Translation"("lgText");

-- CreateIndex
CREATE INDEX "Translation_liText_idx" ON "Translation"("liText");

-- CreateIndex
CREATE INDEX "Translation_lnText_idx" ON "Translation"("lnText");

-- CreateIndex
CREATE INDEX "Translation_loText_idx" ON "Translation"("loText");

-- CreateIndex
CREATE INDEX "Translation_ltText_idx" ON "Translation"("ltText");

-- CreateIndex
CREATE INDEX "Translation_luText_idx" ON "Translation"("luText");

-- CreateIndex
CREATE INDEX "Translation_lvText_idx" ON "Translation"("lvText");

-- CreateIndex
CREATE INDEX "Translation_mgText_idx" ON "Translation"("mgText");

-- CreateIndex
CREATE INDEX "Translation_mhText_idx" ON "Translation"("mhText");

-- CreateIndex
CREATE INDEX "Translation_miText_idx" ON "Translation"("miText");

-- CreateIndex
CREATE INDEX "Translation_mkText_idx" ON "Translation"("mkText");

-- CreateIndex
CREATE INDEX "Translation_mlText_idx" ON "Translation"("mlText");

-- CreateIndex
CREATE INDEX "Translation_mrText_idx" ON "Translation"("mrText");

-- CreateIndex
CREATE INDEX "Translation_msText_idx" ON "Translation"("msText");

-- CreateIndex
CREATE INDEX "Translation_mtText_idx" ON "Translation"("mtText");

-- CreateIndex
CREATE INDEX "Translation_myText_idx" ON "Translation"("myText");

-- CreateIndex
CREATE INDEX "Translation_naText_idx" ON "Translation"("naText");

-- CreateIndex
CREATE INDEX "Translation_nbText_idx" ON "Translation"("nbText");

-- CreateIndex
CREATE INDEX "Translation_ndText_idx" ON "Translation"("ndText");

-- CreateIndex
CREATE INDEX "Translation_neText_idx" ON "Translation"("neText");

-- CreateIndex
CREATE INDEX "Translation_ngText_idx" ON "Translation"("ngText");

-- CreateIndex
CREATE INDEX "Translation_nlText_idx" ON "Translation"("nlText");

-- CreateIndex
CREATE INDEX "Translation_nnText_idx" ON "Translation"("nnText");

-- CreateIndex
CREATE INDEX "Translation_noText_idx" ON "Translation"("noText");

-- CreateIndex
CREATE INDEX "Translation_nrText_idx" ON "Translation"("nrText");

-- CreateIndex
CREATE INDEX "Translation_nvText_idx" ON "Translation"("nvText");

-- CreateIndex
CREATE INDEX "Translation_nyText_idx" ON "Translation"("nyText");

-- CreateIndex
CREATE INDEX "Translation_ocText_idx" ON "Translation"("ocText");

-- CreateIndex
CREATE INDEX "Translation_ojText_idx" ON "Translation"("ojText");

-- CreateIndex
CREATE INDEX "Translation_omText_idx" ON "Translation"("omText");

-- CreateIndex
CREATE INDEX "Translation_orText_idx" ON "Translation"("orText");

-- CreateIndex
CREATE INDEX "Translation_osText_idx" ON "Translation"("osText");

-- CreateIndex
CREATE INDEX "Translation_paText_idx" ON "Translation"("paText");

-- CreateIndex
CREATE INDEX "Translation_piText_idx" ON "Translation"("piText");

-- CreateIndex
CREATE INDEX "Translation_plText_idx" ON "Translation"("plText");

-- CreateIndex
CREATE INDEX "Translation_psText_idx" ON "Translation"("psText");

-- CreateIndex
CREATE INDEX "Translation_ptText_idx" ON "Translation"("ptText");

-- CreateIndex
CREATE INDEX "Translation_quText_idx" ON "Translation"("quText");

-- CreateIndex
CREATE INDEX "Translation_rmText_idx" ON "Translation"("rmText");

-- CreateIndex
CREATE INDEX "Translation_rnText_idx" ON "Translation"("rnText");

-- CreateIndex
CREATE INDEX "Translation_roText_idx" ON "Translation"("roText");

-- CreateIndex
CREATE INDEX "Translation_rwText_idx" ON "Translation"("rwText");

-- CreateIndex
CREATE INDEX "Translation_saText_idx" ON "Translation"("saText");

-- CreateIndex
CREATE INDEX "Translation_scText_idx" ON "Translation"("scText");

-- CreateIndex
CREATE INDEX "Translation_sdText_idx" ON "Translation"("sdText");

-- CreateIndex
CREATE INDEX "Translation_seText_idx" ON "Translation"("seText");

-- CreateIndex
CREATE INDEX "Translation_sgText_idx" ON "Translation"("sgText");

-- CreateIndex
CREATE INDEX "Translation_siText_idx" ON "Translation"("siText");

-- CreateIndex
CREATE INDEX "Translation_skText_idx" ON "Translation"("skText");

-- CreateIndex
CREATE INDEX "Translation_slText_idx" ON "Translation"("slText");

-- CreateIndex
CREATE INDEX "Translation_smText_idx" ON "Translation"("smText");

-- CreateIndex
CREATE INDEX "Translation_snText_idx" ON "Translation"("snText");

-- CreateIndex
CREATE INDEX "Translation_soText_idx" ON "Translation"("soText");

-- CreateIndex
CREATE INDEX "Translation_sqText_idx" ON "Translation"("sqText");

-- CreateIndex
CREATE INDEX "Translation_srText_idx" ON "Translation"("srText");

-- CreateIndex
CREATE INDEX "Translation_ssText_idx" ON "Translation"("ssText");

-- CreateIndex
CREATE INDEX "Translation_stText_idx" ON "Translation"("stText");

-- CreateIndex
CREATE INDEX "Translation_suText_idx" ON "Translation"("suText");

-- CreateIndex
CREATE INDEX "Translation_svText_idx" ON "Translation"("svText");

-- CreateIndex
CREATE INDEX "Translation_swText_idx" ON "Translation"("swText");

-- CreateIndex
CREATE INDEX "Translation_taText_idx" ON "Translation"("taText");

-- CreateIndex
CREATE INDEX "Translation_teText_idx" ON "Translation"("teText");

-- CreateIndex
CREATE INDEX "Translation_tgText_idx" ON "Translation"("tgText");

-- CreateIndex
CREATE INDEX "Translation_tiText_idx" ON "Translation"("tiText");

-- CreateIndex
CREATE INDEX "Translation_tkText_idx" ON "Translation"("tkText");

-- CreateIndex
CREATE INDEX "Translation_tlText_idx" ON "Translation"("tlText");

-- CreateIndex
CREATE INDEX "Translation_tnText_idx" ON "Translation"("tnText");

-- CreateIndex
CREATE INDEX "Translation_toText_idx" ON "Translation"("toText");

-- CreateIndex
CREATE INDEX "Translation_trText_idx" ON "Translation"("trText");

-- CreateIndex
CREATE INDEX "Translation_tsText_idx" ON "Translation"("tsText");

-- CreateIndex
CREATE INDEX "Translation_ttText_idx" ON "Translation"("ttText");

-- CreateIndex
CREATE INDEX "Translation_twText_idx" ON "Translation"("twText");

-- CreateIndex
CREATE INDEX "Translation_tyText_idx" ON "Translation"("tyText");

-- CreateIndex
CREATE INDEX "Translation_ugText_idx" ON "Translation"("ugText");

-- CreateIndex
CREATE INDEX "Translation_ukText_idx" ON "Translation"("ukText");

-- CreateIndex
CREATE INDEX "Translation_urText_idx" ON "Translation"("urText");

-- CreateIndex
CREATE INDEX "Translation_veText_idx" ON "Translation"("veText");

-- CreateIndex
CREATE INDEX "Translation_voText_idx" ON "Translation"("voText");

-- CreateIndex
CREATE INDEX "Translation_waText_idx" ON "Translation"("waText");

-- CreateIndex
CREATE INDEX "Translation_woText_idx" ON "Translation"("woText");

-- CreateIndex
CREATE INDEX "Translation_xhText_idx" ON "Translation"("xhText");

-- CreateIndex
CREATE INDEX "Translation_yiText_idx" ON "Translation"("yiText");

-- CreateIndex
CREATE INDEX "Translation_yoText_idx" ON "Translation"("yoText");

-- CreateIndex
CREATE INDEX "Translation_zaText_idx" ON "Translation"("zaText");

-- CreateIndex
CREATE INDEX "Translation_zuText_idx" ON "Translation"("zuText");
