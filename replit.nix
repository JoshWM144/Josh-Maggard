{pkgs}: {
  deps = [
    pkgs.xsimd
    pkgs.pkg-config
    pkgs.postgresql
    pkgs.libxcrypt
  ];
}
