"use client";

import Image from "next/image";
import { toast } from "sonner";

export default function Footer() {
  return (
    <footer className="bg-surface text-foreground border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image
              src={"/logo_text.png"}
              alt="PONION LOGO"
              onClick={() => {
                toast.success("Installed");
              }}
              width={100}
              height={60}
            />
            <p className="mt-3 text-sm text-text-secondary">
              Fresh, fast, and delicious food delivered right to your doorstep.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a href="#" className="hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a href="#" className="hover:text-primary">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a href="#" className="hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} PONION. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-text-secondary hover:text-primary">
              Facebook
            </a>
            <a href="#" className="text-text-secondary hover:text-primary">
              Instagram
            </a>
            <a href="#" className="text-text-secondary hover:text-primary">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
