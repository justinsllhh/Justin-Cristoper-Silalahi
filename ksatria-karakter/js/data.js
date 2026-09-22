// ============================================================
// DATASET EDUKASI KARAKTER & BUDI PEKERTI
// Kategori: Kejujuran, Empati, Disiplin, Tanggung Jawab,
// Sopan Santun (5S), Anti-Bullying, Gotong Royong
// ============================================================

const GAME_DATA = {
    // ------------------------------------------------------------
    // 1. PETUALANGAN CERITA & DILEMA MORAL
    // ------------------------------------------------------------
    stories: [
        {
            id: "story-1",
            title: "Dompet Terjatuh di Kantin",
            category: "Kejujuran",
            badgeAward: "badge_honesty",
            icon: "👛",
            bgGradient: "linear-gradient(135deg, #FFF1EB 0%, #ACE0F9 100%)",
            scenario: "Saat istirahat makan siang di kantin sekolah, kamu melihat sebuah dompet kecil berwarna cokelat terjatuh di bawah kursi dekat pintu keluar. Tidak ada orang di sekitarnya dan di dalam dompet ada uang saku serta kartu nama teman sekelasmu, Budi.",
            imageMascot: "🤔",
            question: "Apa tindakan terbaik yang harus kamu lakukan sebagai Ksatria Karakter?",
            choices: [
                {
                    text: "Mengambil uangnya untuk beli jajan, lalu membiarkan dompetnya tergeletak.",
                    isBest: false,
                    stars: 0,
                    karma: -10,
                    feedback: "Tindakan ini tidak jujur. Mengambil barang yang bukan milik kita akan merugikan orang lain dan membuat hati kita tidak tenang.",
                    moralLesson: "💡 Kejujuran adalah mahkota utama pahlawan sejati. Barang orang lain harus selalu dihormati."
                },
                {
                    text: "Mengambil dompet tersebut dan segera mengembalikannya langsung kepada Budi atau menitipkannya ke Guru Piket.",
                    isBest: true,
                    stars: 3,
                    karma: 25,
                    feedback: "Luar biasa! Kamu bersikap sangat jujur dan bertanggung jawab. Budi pasti sangat bersyukur dan lega dompetnya tidak hilang!",
                    moralLesson: "🌟 Mengembalikan barang temuan adalah bukti integritas dan hati yang mulia."
                },
                {
                    text: "Mendiamkannya saja dan pura-pura tidak melihat agar tidak repot.",
                    isBest: false,
                    stars: 1,
                    karma: 5,
                    feedback: "Meskipun kamu tidak mengambilnya, bersikap acuh tak acuh bisa membuat dompet itu hilang diambil orang lain yang tidak bertanggung jawab.",
                    moralLesson: "💡 Peduli dan proaktif menolong sesama membuat lingkungan kita lebih aman dan nyaman."
                }
            ]
        },
        {
            id: "story-2",
            title: "Teman Baru yang Duduk Sendirian",
            category: "Empati & Keramahan",
            badgeAward: "badge_empathy",
            icon: "🤝",
            bgGradient: "linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)",
            scenario: "Ada murid pindahan baru bernama Sinta di kelasmu. Waktu istirahat tiba, semua murid bermain bersama, sementara Sinta hanya menunduk malu dan duduk sendirian di sudut pojok kelas sambil meremas jemarinya.",
            imageMascot: "👧",
            question: "Bagaimana caramu menunjukkan sikap ksatria yang ramah dan penuh empati?",
            choices: [
                {
                    text: "Menghampiri Sinta sambil tersenyum, menyapa ramah, dan mengajaknya bergabung bermain bersama teman-teman.",
                    isBest: true,
                    stars: 3,
                    karma: 25,
                    feedback: "Hebat sekali! Tindakanmu membuat Sinta merasa diterima, dihargai, dan tidak merasa kesepian lagi di sekolah barunya.",
                    moralLesson: "🌟 Keramahan sederhana dan senyuman tulus bisa menjadi pelindung kehangatan bagi teman yang membutuhkan."
                },
                {
                    text: "Membiarkannya saja karena berpikir nanti dia akan mencari teman sendiri kalau sudah terbiasa.",
                    isBest: false,
                    stars: 1,
                    karma: 5,
                    feedback: "Murid baru seringkali merasa takut dan canggung. Jika tidak ada yang memulai menyapa, dia bisa merasa terasing.",
                    moralLesson: "💡 Beranilah menjadi orang pertama yang mengulurkan tangan persahabatan."
                },
                {
                    text: "Menertawakannya bersama teman-teman lain karena dia terlihat sangat pemalu.",
                    isBest: false,
                    stars: 0,
                    karma: -15,
                    feedback: "Ini adalah perilaku yang menyakiti hati orang lain. Setiap orang berhak merasa aman dan dihormati di sekolah.",
                    moralLesson: "💡 Jangan pernah mengejek kekurangan atau rasa canggung orang lain."
                }
            ]
        },
        {
            id: "story-3",
            title: "Vas Bunga Kelas Pecah Tanpa Sengaja",
            category: "Tanggung Jawab & Keberanian",
            badgeAward: "badge_courage",
            icon: "🏺",
            bgGradient: "linear-gradient(135deg, #FEE140 0%, #FA709A 100%)",
            scenario: "Saat mengejar bola di dalam kelas padahal ada larangan berlari di dalam ruangan, kakimu tidak sengaja menyenggol meja guru sehingga vas bunga jatuh dan pecah berkeping-keping. Saat itu sedang sepi dan belum ada guru yang masuk.",
            imageMascot: "😨",
            question: "Langkah kesatria apa yang harus kamu tempuh?",
            choices: [
                {
                    text: "Segera kabur keluar kelas dan menyalahkan kucing liar jika nanti Bu Guru bertanya siapa pelakunya.",
                    isBest: false,
                    stars: 0,
                    karma: -15,
                    feedback: "Melarikan diri dan berbohong adalah tindakan pengecut yang melipatgandakan kesalahan.",
                    moralLesson: "💡 Berbohong hanya menutupi masalah sesaat, tetapi menghancurkan kepercayaan selamanya."
                },
                {
                    text: "Menunggu guru datang, lalu dengan berani dan sopan mengakui kesalahan, meminta maaf tulus, serta membantu membersihkan pecahannya.",
                    isBest: true,
                    stars: 3,
                    karma: 25,
                    feedback: "Salut atas keberanianmu! Mengakui kesalahan membutuhkan jiwa kesatria yang besar dan hati yang jujur.",
                    moralLesson: "🌟 Berani bertanggung jawab atas kesalahan adalah tanda kedewasaan dan karakter yang tangguh."
                },
                {
                    text: "Membersihkan pecahan diam-diam lalu pura-pura tidak tahu sama sekali siapa yang memecahkannya.",
                    isBest: false,
                    stars: 1,
                    karma: 5,
                    feedback: "Membersihkan pecahan itu baik untuk keamanan, tetapi menyembunyikan kenyataan tetaplah bentuk ketidakjujuran.",
                    moralLesson: "💡 Lengkapi tindakan baikmu dengan kejujuran yang utuh."
                }
            ]
        },
        {
            id: "story-4",
            title: "Membela Teman dari Ejekan (Stop Bullying)",
            category: "Anti-Bullying & Keadilan",
            badgeAward: "badge_shield",
            icon: "🛡️",
            bgGradient: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
            scenario: "Di lorong sekolah, kamu melihat sekelompok anak sedang mengelilingi Doni dan menertawakan tas sekolahnya yang sudah usang dan bertambal. Doni tampak menahan tangis dan tertunduk malu.",
            imageMascot: "🛡️",
            question: "Bagaimana Ksatria Karakter merespons situasi perundungan (bullying) ini?",
            choices: [
                {
                    text: "Ikut tertawa bersama mereka supaya dianggap keren dan tidak ikut dimusuhi oleh kelompok tersebut.",
                    isBest: false,
                    stars: 0,
                    karma: -20,
                    feedback: "Ikut mengejek berarti menjadi bagian dari pelaku bullying. Kita harus selalu berada di pihak kebenaran.",
                    moralLesson: "💡 Nilai seorang anak diukur dari kebaikan budinya, bukan dari mewahnya barang bawaannya."
                },
                {
                    text: "Berani mendekat dengan tenang, meminta mereka berhenti mengejek, lalu mengajak Doni pergi menjauh dan melapor pada guru jika diperlukan.",
                    isBest: true,
                    stars: 3,
                    karma: 30,
                    feedback: "Pemberani sejati! Kamu menjadi perisai bagi temanmu dan menolak perundungan dengan bijak dan tegas.",
                    moralLesson: "🌟 Ksatria sejati menggunakan kekuatannya untuk membela yang lemah, bukan menindas."
                },
                {
                    text: "Membalas dengan memukul dan memaki anak-anak yang mengejek Doni sampai berkelahi.",
                    isBest: false,
                    stars: 1,
                    karma: 0,
                    feedback: "Niatmu membela teman sangat baik, tetapi membalas kekerasan dengan kekerasan fisik akan menimbulkan masalah baru.",
                    moralLesson: "💡 Selesaikan konflik dengan ketegasan yang damai dan melibatkan pihak berwenang (guru/orang tua)."
                }
            ]
        },
        {
            id: "story-5",
            title: "Berbagi Bekal dengan Sahabat",
            category: "Gotong Royong & Berbagi",
            badgeAward: "badge_generosity",
            icon: "🍱",
            bgGradient: "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)",
            scenario: "Ibumu membawakan kotak bekal berisi nasi goreng lezat dan potongan buah yang cukup banyak. Di sebelahmu, Edo terlihat lesu karena uang sakunya hilang dan dia tidak membawa makanan dari rumah.",
            imageMascot: "😋",
            question: "Tindakan penuh kasih apa yang akan kamu lakukan?",
            choices: [
                {
                    text: "Membagi sebagian nasi goreng dan buahmu ke piring atau tutup bekal untuk dinikmati bersama Edo.",
                    isBest: true,
                    stars: 3,
                    karma: 25,
                    feedback: "Mulianya hatimu! Berbagi makanan saat teman kelaparan adalah wujud kasih sayang nyata yang mempererat persaudaraan.",
                    moralLesson: "🌟 Kebahagiaan akan berlipat ganda saat kita bersedia membaginya dengan sesama."
                },
                {
                    text: "Menyantap bekalmu dengan cepat di depan Edo sambil menceritakan betapa lezatnya makananmu.",
                    isBest: false,
                    stars: 0,
                    karma: -15,
                    feedback: "Tindakan ini tidak memiliki empati dan bisa menyakiti perasaan teman yang sedang lapar.",
                    moralLesson: "💡 Jagalah perasaan orang lain di sekitar kita dengan sikap rendah hati."
                },
                {
                    text: "Menawarkan makanan kepada Edo tetapi meminta bayaran separuh harga saat dia sudah punya uang nanti.",
                    isBest: false,
                    stars: 1,
                    karma: 5,
                    feedback: "Membantu sesama teman seharusnya didasari rasa tulus dan ikhlas tanpa pamrih imbalan.",
                    moralLesson: "💡 Kebaikan yang paling tulus adalah kebaikan tanpa mengharapkan balasan materi."
                }
            ]
        },
        {
            id: "story-6",
            title: "Budaya Antre di Perpustakaan",
            category: "Disiplin & Kesabaran",
            badgeAward: "badge_discipline",
            icon: "📚",
            bgGradient: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
            scenario: "Di perpustakaan sedang ada peminjaman buku ensiklopedia cerita bergambar edisi terbaru yang sangat kamu nantikan. Sudah ada 5 teman yang berdiri rapi mengantre di depan meja pustakawan.",
            imageMascot: "📖",
            question: "Bagaimana cara menunjukkan kedisiplinan dan menghargai hak orang lain?",
            choices: [
                {
                    text: "Menyerobot antrean langsung ke depan dengan alasan kamu sedang terburu-buru ada urusan lain.",
                    isBest: false,
                    stars: 0,
                    karma: -15,
                    feedback: "Menyerobot antrean melanggar hak orang lain yang sudah datang lebih dahulu dan menunjukkan sikap tidak disiplin.",
                    moralLesson: "💡 Menghormati antrean adalah wujud penghargaan terhadap hak dan waktu orang lain."
                },
                {
                    text: "Berdiri dengan tertib di barisan paling belakang dan menunggu giliran dengan sabar tanpa mengeluh.",
                    isBest: true,
                    stars: 3,
                    karma: 25,
                    feedback: "Disiplin jempolan! Budaya antre mencerminkan bangsa yang beradab dan pribadi yang menghargai aturan bersama.",
                    moralLesson: "🌟 Kesabaran dalam menaati aturan membuat hidup bermasyarakat menjadi harmonis dan teratur."
                },
                {
                    text: "Menyuruh teman di depanmu untuk meminjamkan buku itu untukmu dulu setelah dia dapat giliran.",
                    isBest: false,
                    stars: 1,
                    karma: 5,
                    feedback: "Lebih baik kita belajar mandiri dan mematuhi tata tertib peminjaman sendiri.",
                    moralLesson: "💡 Kemandirian dan kepatuhan aturan perpustakaan harus dijaga bersama."
                }
            ]
        },
        {
            id: "story-7",
            title: "Sampah Plastik di Halaman Sekolah",
            category: "Tanggung Jawab Lingkungan",
            badgeAward: "badge_nature",
            icon: "🌱",
            bgGradient: "linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)",
            scenario: "Setelah jam olahraga selesai, kamu melihat beberapa botol plastik dan bungkus biskuit berserakan di bawah pohon tempat teman-temanmu tadi duduk beristirahat.",
            imageMascot: "🌳",
            question: "Sebagai penjaga kelestarian lingkungan sekolah, apa yang kamu lakukan?",
            choices: [
                {
                    text: "Mengabaikannya karena berpikir itu bukan sampah milikmu sendiri dan ada petugas kebersihan yang digaji.",
                    isBest: false,
                    stars: 0,
                    karma: -5,
                    feedback: "Menjaga kebersihan bumi dan sekolah adalah tanggung jawab kita semua, bukan hanya petugas kebersihan.",
                    moralLesson: "💡 Bumi yang bersih tercipta dari kepedulian setiap insan di dalamnya."
                },
                {
                    text: "Mengambil sampah-sampah tersebut dan membuangnya ke tempat sampah yang sesuai (organik / anorganik).",
                    isBest: true,
                    stars: 3,
                    karma: 25,
                    feedback: "Luar biasa peduli! Satu tindakan kecilmu menjaga keindahan sekolah dan menyelamatkan lingkungan hidup.",
                    moralLesson: "🌟 Memungut sampah tanpa disuruh adalah ciri sejati pahlawan lingkungan masa depan."
                },
                {
                    text: "Menendang sampah tersebut ke semak-semak agar tidak terlalu kelihatan dari tengah lapangan.",
                    isBest: false,
                    stars: 0,
                    karma: -10,
                    feedback: "Membuang sampah ke semak tetap merusak lingkungan dan membuat sarang nyamuk berbahaya.",
                    moralLesson: "💡 Selalu letakkan sampah pada tempat penampungan yang semestinya."
                }
            ]
        },
        {
            id: "story-8",
            title: "Membantu Nenek Menyeberang Jalan",
            category: "Sopan Santun & Hormat",
            badgeAward: "badge_respect",
            icon: "👵",
            bgGradient: "linear-gradient(135deg, #FA709A 0%, #FEE140 100%)",
            scenario: "Saat berjalan pulang sekolah di dekat lampu lalu lintas, ada seorang nenek tua membawa tas belanjaan berat yang terlihat ragu-ragu dan kesulitan melangkah untuk menyeberangi jalan raya.",
            imageMascot: "🚶‍♂️",
            question: "Bagaimana wujud penghormatan dan baktimu kepada orang tua?",
            choices: [
                {
                    text: "Mendekati nenek dengan sopan (5S: Senyum, Salam, Sapa), menawarkan bantuan membawa tas, dan mendampingi menyeberang saat lampu penyeberangan aman.",
                    isBest: true,
                    stars: 3,
                    karma: 30,
                    feedback: "Hati emas! Menghormati dan membantu kaum lansia adalah budi pekerti luhur yang sangat membanggakan.",
                    moralLesson: "🌟 Menghormati yang lebih tua dan menyayangi sesama adalah pondasi utama kemuliaan akhlak."
                },
                {
                    text: "Berjalan melewatinya dengan terburu-buru sambil bermain game di ponsel tanpa peduli keadaan sekitar.",
                    isBest: false,
                    stars: 0,
                    karma: -10,
                    feedback: "Terlalu asyik dengan gawai membuat kita kehilangan kepekaan sosial terhadap orang yang butuh bantuan.",
                    moralLesson: "💡 Angkat kepalamu, perhatikan sekelilingmu, ada banyak peluang berbuat baik setiap hari."
                },
                {
                    text: "Meneriaki pengendara motor dari kejauhan dengan marah-marah agar berhenti.",
                    isBest: false,
                    stars: 1,
                    karma: 5,
                    feedback: "Berniat baik menyeberangkan orang harus dilakukan dengan cara yang sopan, tenang, dan aman, bukan dengan kemarahan.",
                    moralLesson: "💡 Kebaikan yang disampaikan dengan sopan santun akan menghasilkan kedamaian."
                }
            ]
        }
    ],

    // ------------------------------------------------------------
    // 2. DETEKTIF PERILAKU (SORTING GAME: TERPUJI VS TERCELA)
    // ------------------------------------------------------------
    sortingCards: [
        {
            id: "sort-1",
            text: "Mengucapkan 'Tolong' saat meminta bantuan dan 'Terima Kasih' setelah dibantu.",
            category: "terpuji",
            icon: "🙏",
            explanation: "Sopan santun adalah kunci komunikasi yang menyenangkan dan menghargai orang lain."
        },
        {
            id: "sort-2",
            text: "Menertawakan teman yang tidak sengaja terpeleset di lapangan sekolah.",
            category: "tercela",
            icon: "😆",
            explanation: "Menertawakan musibah orang lain tidak menunjukkan rasa empati. Seharusnya kita segera menolongnya."
        },
        {
            id: "sort-3",
            text: "Mengembalikan sisa uang kembalian yang berlebih kepada pedagang kantin.",
            category: "terpuji",
            icon: "💰",
            explanation: "Kejujuran dalam hal sekecil apa pun akan membentuk kepribadian yang dapat dipercaya."
        },
        {
            id: "sort-4",
            text: "Mencoret-coret dinding toilet sekolah dan meja belajar kelas.",
            category: "tercela",
            icon: "🖍️",
            explanation: "Vandalisme merusak fasilitas umum yang menjadi hak belajar bersama."
        },
        {
            id: "sort-5",
            text: "Mendengarkan dengan seksama saat guru atau teman sedang berbicara.",
            category: "terpuji",
            icon: "👂",
            explanation: "Menyimak adalah bentuk tertinggi dari rasa hormat dan penghargaan kepada sesama."
        },
        {
            id: "sort-6",
            text: "Memotong pembicaraan orang tua atau guru dengan suara keras.",
            category: "tercela",
            icon: "🗣️",
            explanation: "Memotong pembicaraan adalah sikap kurang sopan. Tunggulah hingga orang lain selesai berbicara."
        },
        {
            id: "sort-7",
            text: "Menyapa teman yang berbeda suku, agama, dan asal daerah dengan ramah.",
            category: "terpuji",
            icon: "🌈",
            explanation: "Toleransi dan persatuan dalam kebinekaan membuat Indonesia rukun dan damai."
        },
        {
            id: "sort-8",
            text: "Menyebarkan rahasia atau keburukan teman kepada orang lain.",
            category: "tercela",
            icon: "🤫",
            explanation: "Menyebarkan aib atau bergosip merusak tali persahabatan dan kepercayaan."
        },
        {
            id: "sort-9",
            text: "Merapikan tempat tidur sendiri setiap bangun tidur di pagi hari.",
            category: "terpuji",
            icon: "🛏️",
            explanation: "Kemandirian dan disiplin diri dimulai dari rutinitas sederhana di rumah."
        },
        {
            id: "sort-10",
            text: "Menyontek jawaban tugas milik teman saat ujian berlangsung.",
            category: "tercela",
            icon: "📝",
            explanation: "Menyontek adalah perbuatan curang yang merugikan diri sendiri dalam belajar mandiri."
        },
        {
            id: "sort-11",
            text: "Menghibur sahabat yang sedang bersedih atau kehilangan barang kesayangan.",
            category: "terpuji",
            icon: "🤗",
            explanation: "Empati dan kepedulian meringankan beban duka yang dirasakan sahabat kita."
        },
        {
            id: "sort-12",
            text: "Membuang kulit pisang di sembarang jalan umum.",
            category: "tercela",
            icon: "🍌",
            explanation: "Membuang sampah sembarangan bisa membuat orang lain terpeleset dan celaka."
        },
        {
            id: "sort-13",
            text: "Datang ke sekolah tepat waktu sebelum bel masuk berbunyi.",
            category: "terpuji",
            icon: "⏰",
            explanation: "Disiplin waktu mencerminkan pribadi yang menghargai komitmen dan tanggung jawab."
        },
        {
            id: "sort-14",
            text: "Memanggil teman dengan sebutan julukan fisik yang mengejek.",
            category: "tercela",
            icon: "🚫",
            explanation: "Body shaming atau ejekan fisik adalah bentuk perundungan (bullying) verbal."
        },
        {
            id: "sort-15",
            text: "Membantu adik belajar membaca atau merapikan mainan yang berserakan.",
            category: "terpuji",
            icon: "🧸",
            explanation: "Kasih sayang dalam keluarga menciptakan suasana rumah yang hangat dan penuh cinta."
        },
        {
            id: "sort-16",
            text: "Menolak bekerja sama dalam tugas kelompok karena ingin bermain sendiri.",
            category: "tercela",
            icon: "🙅",
            explanation: "Egois dalam kelompok merugikan teman-teman dan menghambat tercapainya tujuan bersama."
        }
    ],

    // ------------------------------------------------------------
    // 3. MISI AKSI KEBAIKAN (EMPATHY & SITUATION MATCH)
    // ------------------------------------------------------------
    missions: [
        {
            id: "mis-1",
            situation: "Kakek membawa banyak kantong belanjaan yang berat saat menaiki tangga jembatan penyeberangan.",
            icon: "👴",
            options: [
                { text: "Berlari mendahului kakek sambil berteriak agar cepat jalan.", isCorrect: false },
                { text: "Menawarkan diri membawakan sebagian kantong belanjaan dengan senyuman santun.", isCorrect: true, feedback: "Bagus sekali! Menghormati lansia adalah budi pekerti mulia." },
                { text: "Memotret kakek lalu mengunggahnya ke media sosial.", isCorrect: false }
            ]
        },
        {
            id: "mis-2",
            situation: "Teman sebangku tidak sengaja menumpahkan air minum dan membasahi sebagian buku tulismu.",
            icon: "💧",
            options: [
                { text: "Memarahinya di depan seluruh kelas dan menuntut ganti rugi besar.", isCorrect: false },
                { text: "Membalas dengan menumpahkan air ke tasnya.", isCorrect: false },
                { text: "Memaafkannya karena dia tidak sengaja, lalu bersama-sama mengelap buku dengan tisu.", isCorrect: true, feedback: "Pemaaf yang bijaksana! Memaafkan kesalahan yang tidak disengaja menjaga kerukunan." }
            ]
        },
        {
            id: "mis-3",
            situation: "Ibu tampak sangat lelah setelah selesai memasak dan mencuci piring di dapur.",
            icon: "👩",
            options: [
                { text: "Menghampiri ibu, membawakan segelas air putih hangat, dan memijat bahu ibu.", isCorrect: true, feedback: "Anak berbakti! Kasih sayang kepada orang tua mendatangkan kebahagiaan sejati." },
                { text: "Membentak ibu menuntut camilan manis tambahan.", isCorrect: false },
                { text: "Meninggalkan mainan berserakan di ruang tamu.", isCorrect: false }
            ]
        },
        {
            id: "mis-4",
            situation: "Saat bermain bola bersama, ada teman yang kalah dan mulai menangis sedih.",
            icon: "⚽",
            options: [
                { text: "Menyemangatinya: 'Permainanmu tadi hebat! Menang kalah itu biasa, yuk main bareng lagi!'.", isCorrect: true, feedback: "Sportivitas sejati! Menghargai proses bermain jauh lebih berharga daripada sekadar skor." },
                { text: "Menjulurkan lidah dan menari mengejeknya.", isCorrect: false },
                { text: "Menyuruhnya pulang dan melarangnya bermain lagi selamanya.", isCorrect: false }
            ]
        },
        {
            id: "mis-5",
            situation: "Guru sedang sibuk membawa tumpukan buku ulangan yang sangat tebal menuju ruang guru.",
            icon: "👩‍🏫",
            options: [
                { text: "Pura-pura mengikat tali sepatu agar tidak diminta bantuan.", isCorrect: false },
                { text: "Menyapa guru dengan santun: 'Ibu guru, boleh saya bantu membawakan separuh bukunya?'.", isCorrect: true, feedback: "Sikap teladan! Membantu bapak/ibu guru adalah bentuk bakti murid yang terpuji." },
                { text: "Berlari kencang menyenggol buku guru.", isCorrect: false }
            ]
        },
        {
            id: "mis-6",
            situation: "Melihat tanaman bunga di halaman sekolah layu karena cuaca terik dan belum disiram.",
            icon: "🌻",
            options: [
                { text: "Mengambil gayung/selang air dan menyirami tanaman secara teratur.", isCorrect: true, feedback: "Sahabat alam! Menyayangi tumbuhan ciptaan Tuhan adalah bukti kepedulian lingkungan." },
                { text: "Memetik bunga yang layu lalu menginjak-injaknya.", isCorrect: false },
                { text: "Membiarkannya mati kekeringan.", isCorrect: false }
            ]
        }
    ],

    // ------------------------------------------------------------
    // 4. KUIS KSATRIA BINTANG (TRIVIA & PEMAHAMAN KARAKTER)
    // ------------------------------------------------------------
    quiz: [
        {
            id: "q-1",
            question: "Prinsip 5S dalam budaya sopan santun di Indonesia terdiri dari...",
            icon: "✨",
            options: [
                "Senyum, Salam, Sapa, Sopan, Santun",
                "Santai, Senang, Seru, Sukses, Sempurna",
                "Suara, Semangat, Sabar, Selesai, Setuju",
                "Suka, Sembunyi, Sedih, Sayang, Sepakat"
            ],
            answerIndex: 0,
            explanation: "5S (Senyum, Salam, Sapa, Sopan, Santun) adalah pilar budaya keramahan dan etika pergaulan yang luhur."
        },
        {
            id: "q-2",
            question: "Apa arti dari bersikap 'Integritas' dalam kehidupan sehari-hari?",
            icon: "💎",
            options: [
                "Hanya berbuat baik saat sedang diawasi oleh guru dan orang tua",
                "Tetap berkata jujur dan berbuat benar meskipun tidak ada orang lain yang melihat",
                "Mencari keuntungan sebanyak-banyaknya untuk diri sendiri",
                "Menuruti semua perintah teman yang salah agar tidak dijauhi"
            ],
            answerIndex: 1,
            explanation: "Integritas adalah keselarasan antara hati, ucapan, dan tindakan benar dalam setiap keadaan."
        },
        {
            id: "q-3",
            question: "Jika ada temanmu yang berbuat salah kepadamu lalu meminta maaf dengan tulus, sikapmu sebaiknya...",
            icon: "🤍",
            options: [
                "Menolak maafnya dan membalas perbuatannya esok hari",
                "Menerima maafnya dengan ikhlas dan tidak mengungkit-ungkit kesalahannya lagi",
                "Meminta uang tebusan sebagai syarat memaafkan",
                "Menceritakan kesalahan temanmu ke seluruh media sosial"
            ],
            answerIndex: 1,
            explanation: "Memaafkan dengan tulus membebaskan hati dari dendam dan mempererat rasa persaudaraan."
        },
        {
            id: "q-4",
            question: "Gotong royong adalah salah satu nilai luhur bangsa Indonesia yang tercermin dalam tindakan...",
            icon: "🇮🇩",
            options: [
                "Bekerja bakti membersihkan lingkungan selokan bersama warga dengan sukarela",
                "Meminta orang lain menyelesaikan pekerjaan rumah kita",
                "Menonton tetangga yang sedang kesulitan tanpa ikut membantu",
                "Membayar orang lain untuk menggantikan giliran piket kelas"
            ],
            answerIndex: 0,
            explanation: "Gotong royong memperingan pekerjaan berat dan merekatkan persatuan antarwarga masyarakat."
        },
        {
            id: "q-5",
            question: "Tindakan apa yang paling tepat saat kamu melihat perundungan (bullying) terjadi di depan matamu?",
            icon: "🛑",
            options: [
                "Tersenyum dan merekam video untuk dijadikan konten hiburan",
                "Ikut mengejek korban agar terlihat berani",
                "Melapor kepada guru/petugas berwenang dan membela korban dengan cara aman",
                "Pura-pura tidak melihat dan langsung pergi jajan"
            ],
            answerIndex: 2,
            explanation: "Menjadi saksi yang peduli (upstander) membantu menyelamatkan teman dari dampak buruk perundungan."
        },
        {
            id: "q-6",
            question: "Ketika kamu berjanji akan mengembalikan buku perpustakaan pada hari Senin, maka kamu harus...",
            icon: "📅",
            options: [
                "Mengembalikannya tepat waktu pada hari Senin sebagai bentuk komitmen dan tanggung jawab",
                "Mengembalikannya bulan depan jika sudah ingat",
                "Menyembunyikan buku tersebut di bawah kasur",
                "Memberikan buku itu kepada orang lain tanpa izin perpustakaan"
            ],
            answerIndex: 0,
            explanation: "Menepati janji adalah ciri pribadi terpercaya yang menghargai komitmen dan tata tertib."
        },
        {
            id: "q-7",
            question: "Bagaimana cara terbaik menghargai teman yang sedang menjalankan ibadah sesuai agamanya?",
            icon: "🕊️",
            options: [
                "Mengajaknya bermain dengan paksa di saat waktu ibadahnya tiba",
                "Menjaga ketenangan di sekitar tempat ibadah dan memberinya ruang dengan penuh hormat",
                "Mengolok-olok tata cara ibadah yang berbeda dari kita",
                "Mengunci pintu tempat ibadahnya dari luar"
            ],
            answerIndex: 1,
            explanation: "Toleransi antarumat beragama adalah kunci kerukunan dan kedamaian dalam keberagaman Indonesia."
        },
        {
            id: "q-8",
            question: "Mengapa kita harus membiasakan diri mengucapkan kata 'Permisi' saat lewat di depan orang yang lebih tua?",
            icon: "👣",
            options: [
                "Sebagai wujud tata krama, kesantunan, dan rasa hormat kepada yang lebih tua",
                "Supaya diberi hadiah uang saku oleh orang tersebut",
                "Hanya sekadar formalitas tanpa makna",
                "Supaya orang tersebut takut kepada kita"
            ],
            answerIndex: 0,
            explanation: "Kata permisi dan membungkukkan badan sedikit mencerminkan adab ketimuran yang luhur dan santun."
        }
    ],

    // ------------------------------------------------------------
    // 5. MEDALI & PENGHARGAAN KSATRIA (UNLOCKABLES)
    // ------------------------------------------------------------
    badges: [
        {
            id: "badge_honesty",
            title: "Perisai Kejujuran",
            icon: "🛡️",
            description: "Diberikan kepada ksatria yang selalu menjunjung tinggi kebenaran dan integritas.",
            category: "Kejujuran",
            color: "#3B82F6"
        },
        {
            id: "badge_empathy",
            title: "Hati Emas",
            icon: "💛",
            description: "Diberikan kepada ksatria yang memiliki rasa empati tinggi dan kepedulian tulus.",
            category: "Empati",
            color: "#F59E0B"
        },
        {
            id: "badge_courage",
            title: "Api Keberanian",
            icon: "🔥",
            description: "Diberikan kepada ksatria yang berani mengakui kesalahan dan bertanggung jawab.",
            category: "Keberanian",
            color: "#EF4444"
        },
        {
            id: "badge_shield",
            title: "Pelindung Sahabat",
            icon: "⭐",
            description: "Diberikan kepada ksatria yang aktif membela keadilan dan menolak bullying.",
            category: "Anti-Bullying",
            color: "#8B5CF6"
        },
        {
            id: "badge_generosity",
            title: "Bintang Kemurahan",
            icon: "🎁",
            description: "Diberikan kepada ksatria yang gemar berbagi dan suka tolong-menolong.",
            category: "Berbagi",
            color: "#EC4899"
        },
        {
            id: "badge_discipline",
            title: "Sayap Disiplin",
            icon: "🕊️",
            description: "Diberikan kepada ksatria yang taat aturan, tepat waktu, dan sabar mengantre.",
            category: "Disiplin",
            color: "#10B981"
        },
        {
            id: "badge_nature",
            title: "Penjaga Kelestarian",
            icon: "🌿",
            description: "Diberikan kepada ksatria yang mencintai lingkungan hidup dan kebersihan.",
            category: "Lingkungan",
            color: "#059669"
        },
        {
            id: "badge_respect",
            title: "Mahkota Kesantunan",
            icon: "👑",
            description: "Diberikan kepada ksatria yang mengamalkan 5S dan menghormati orang tua/guru.",
            category: "Sopan Santun",
            color: "#6366F1"
        }
    ],

    // ------------------------------------------------------------
    // 6. TAHAPAN PERTUMBUHAN POHON KEBAIKAN
    // ------------------------------------------------------------
    treeStages: [
        {
            stage: 0,
            minPoints: 0,
            title: "Tunas Kebaikan Mula",
            desc: "Benih budi pekertimu baru saja disemai di tanah yang subur.",
            icon: "🌱"
        },
        {
            stage: 1,
            minPoints: 50,
            title: "Batang Kejujuran Muda",
            desc: "Pohonmu mulai tumbuh kokoh dengan tunas hijau yang bersinar.",
            icon: "🌿"
        },
        {
            stage: 2,
            minPoints: 120,
            title: "Ranting Empati Berbunga",
            desc: "Kuntum-kuntum bunga kebaikan mulai merekah dan harum semerbak.",
            icon: "🌸"
        },
        {
            stage: 3,
            minPoints: 220,
            title: "Pohon Karakter Rindang",
            desc: "Dedaunan lebat menaungi sekeliling, burung-burung kebahagiaan berdatangan.",
            icon: "🌳"
        },
        {
            stage: 4,
            minPoints: 350,
            title: "Pohon Emas Kebajikan Agung",
            desc: "Pohonmu berbuah emas berkilau! Kamu adalah Ksatria Karakter Teladan Sejati!",
            icon: "✨🌳✨"
        }
    ]
};

window.GAME_DATA = GAME_DATA;
